const express = require("express");
const path = require("path");
const crypto = require("crypto");
const db = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const clients = [];

function sendEvent(type, data) {
  const event = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;

  clients.forEach((client) => {
    client.write(event);
  });
}

app.get("/api/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders();

  clients.push(res);

  req.on("close", () => {
    const index = clients.indexOf(res);

    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

app.get("/api/riders", (req, res) => {
  const riders = db.prepare("SELECT * FROM riders").all();

  res.json(riders);
});

app.get("/api/deliveries", (req, res) => {
  const deliveries = db.prepare(`
    SELECT
      deliveries.*,
      riders.name AS rider_name
    FROM deliveries
    LEFT JOIN riders ON deliveries.rider_id = riders.id
    ORDER BY deliveries.created_at DESC
  `).all();

  res.json(deliveries);
});

app.post("/api/deliveries", (req, res) => {
  const {
    customerName,
    customerPhone,
    deliveryAddress,
    itemDescription
  } = req.body;

  if (
    !customerName ||
    !customerPhone ||
    !deliveryAddress ||
    !itemDescription
  ) {
    return res.status(400).json({
      error: "All delivery fields are required."
    });
  }

  const confirmationCode = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  const result = db.prepare(`
    INSERT INTO deliveries (
      customer_name,
      customer_phone,
      delivery_address,
      item_description,
      confirmation_code
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    customerName,
    customerPhone,
    deliveryAddress,
    itemDescription,
    confirmationCode
  );

  const deliveryId = result.lastInsertRowid;

  db.prepare(`
    INSERT INTO status_history (delivery_id, status)
    VALUES (?, ?)
  `).run(deliveryId, "OPEN");

  const delivery = db.prepare(
    "SELECT * FROM deliveries WHERE id = ?"
  ).get(deliveryId);

  sendEvent("delivery-created", delivery);

  res.status(201).json(delivery);
});

app.post("/api/deliveries/:id/assign", (req, res) => {
  const deliveryId = req.params.id;
  const { riderId } = req.body;

  const delivery = db.prepare(
    "SELECT * FROM deliveries WHERE id = ?"
  ).get(deliveryId);

  if (!delivery) {
    return res.status(404).json({
      error: "Delivery not found."
    });
  }

  const currentStatus = String(delivery.status || "").trim().toUpperCase();

  if (currentStatus !== "OPEN") {
    return res.status(409).json({
      error: "Delivery has already been assigned."
    });
  }

  const rider = db.prepare(
    "SELECT * FROM riders WHERE id = ?"
  ).get(riderId);

  if (!rider) {
    return res.status(404).json({
      error: "Rider not found."
    });
  }

  db.prepare(`
    UPDATE deliveries
    SET rider_id = ?, status = 'ASSIGNED',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(riderId, deliveryId);

  db.prepare(`
    INSERT INTO status_history (delivery_id, status)
    VALUES (?, ?)
  `).run(deliveryId, "ASSIGNED");

  const updatedDelivery = db.prepare(`
    SELECT deliveries.*, riders.name AS rider_name
    FROM deliveries
    LEFT JOIN riders ON deliveries.rider_id = riders.id
    WHERE deliveries.id = ?
  `).get(deliveryId);

  sendEvent("delivery-assigned", updatedDelivery);

  res.json(updatedDelivery);
});

app.patch("/api/deliveries/:id/status", (req, res) => {
  const deliveryId = req.params.id;
  const status = String(req.body.status || "").trim().toUpperCase();

  const delivery = db.prepare(
    "SELECT * FROM deliveries WHERE id = ?"
  ).get(deliveryId);

  if (!delivery) {
    return res.status(404).json({
      error: "Delivery not found."
    });
  }

  const currentStatus = String(delivery.status || "").trim().toUpperCase();
  const isValidTransition =
    currentStatus === "ASSIGNED" && status === "PICKED_UP";

  if (!isValidTransition) {
    return res.status(400).json({
      error: `Cannot change status from ${delivery.status} to ${status}.`
    });
  }

  db.prepare(`
    UPDATE deliveries
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, deliveryId);

  db.prepare(`
    INSERT INTO status_history (delivery_id, status)
    VALUES (?, ?)
  `).run(deliveryId, status);

  const updatedDelivery = db.prepare(
    "SELECT * FROM deliveries WHERE id = ?"
  ).get(deliveryId);

  sendEvent("status-updated", updatedDelivery);

  res.json(updatedDelivery);
});

app.post("/api/deliveries/:id/confirm", (req, res) => {
  const deliveryId = req.params.id;
  const { confirmationCode } = req.body;

  const delivery = db.prepare(
    "SELECT * FROM deliveries WHERE id = ?"
  ).get(deliveryId);

  if (!delivery) {
    return res.status(404).json({
      error: "Delivery not found."
    });
  }

  const currentStatus = String(delivery.status || "").trim().toUpperCase();

  if (currentStatus !== "PICKED_UP") {
    return res.status(400).json({
      error: "Delivery must be PICKED_UP before confirmation."
    });
  }

  if (delivery.confirmation_code !== confirmationCode) {
    return res.status(400).json({
      error: "Invalid confirmation code."
    });
  }

  db.prepare(`
    UPDATE deliveries
    SET status = 'DELIVERED',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(deliveryId);

  db.prepare(`
    INSERT INTO status_history (delivery_id, status)
    VALUES (?, ?)
  `).run(deliveryId, "DELIVERED");

  db.prepare(`
    INSERT INTO confirmations (
      delivery_id,
      confirmation_code
    )
    VALUES (?, ?)
  `).run(deliveryId, confirmationCode);

  const updatedDelivery = db.prepare(
    "SELECT * FROM deliveries WHERE id = ?"
  ).get(deliveryId);

  sendEvent("delivery-confirmed", updatedDelivery);

  res.json(updatedDelivery);
});

app.get("/api/deliveries/:id/history", (req, res) => {
  const history = db.prepare(`
    SELECT *
    FROM status_history
    WHERE delivery_id = ?
    ORDER BY changed_at ASC
  `).all(req.params.id);

  res.json(history);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});