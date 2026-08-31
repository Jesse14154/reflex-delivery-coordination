const riderFilter =
  document.getElementById(
    "riderFilter"
  );

const riderDeliveries =
  document.getElementById(
    "riderDeliveries"
  );


let deliveries = [];


async function loadRiders() {

  const response =
    await fetch(
      "/api/riders"
    );

  const riders =
    await response.json();


  riders.forEach((rider) => {

    riderFilter.innerHTML += `

      <option
        value="${rider.id}"
      >

        ${rider.name}

      </option>

    `;

  });

}


async function loadDeliveries() {

  const response =
    await fetch(
      "/api/deliveries"
    );

  deliveries =
    await response.json();


  renderRiderDeliveries();

}


riderFilter.addEventListener(
  "change",
  renderRiderDeliveries
);


function renderRiderDeliveries() {

  riderDeliveries.innerHTML = "";


  const selectedRider =
    riderFilter.value;


  if (!selectedRider) {

    riderDeliveries.innerHTML =

      "<p class=\"empty-note\">Select your rider profile to view deliveries.</p>";

    return;

  }


  const riderItems =
    deliveries.filter(

      delivery =>

        delivery.rider_id ==
        selectedRider

    );


  if (
    riderItems.length === 0
  ) {

    riderDeliveries.innerHTML =

      "<p class=\"empty-note\">You currently have no assigned deliveries.</p>";

    return;

  }


  riderItems.forEach((delivery) => {

    const isDelivered =
      delivery.status === "DELIVERED";

    const deliveredTimeRow =
      isDelivered
        ? `<div class="time-item"><span class="time-icon">✅</span><strong>Delivered</strong> ${formatDateTime(delivery.updated_at)}</div>`
        : "";

    riderDeliveries.innerHTML += `

      <div class="delivery-card ${isDelivered ? "is-delivered" : ""}">

        <div class="delivery-card-head">
          <div>
            <h3>Delivery #${delivery.id}</h3>
            <p class="cust-name">${delivery.customer_name}</p>
          </div>
          <span class="status status-${delivery.status.toLowerCase()}">
            ${delivery.status}
          </span>
        </div>


        <p>
          <strong>Phone</strong>
          ${delivery.customer_phone}
        </p>


        <p>
          <strong>Address</strong>
          ${delivery.delivery_address}
        </p>


        <p>
          <strong>Item</strong>
          ${delivery.item_description}
        </p>

        <div class="timestamps">
          <div class="time-item"><span class="time-icon">🕒</span><strong>Booked</strong> ${formatDateTime(delivery.created_at)}</div>
          ${deliveredTimeRow}
        </div>


        <div class="actions">

          ${getRiderActions(delivery)}

        </div>

        ${getConfirmBox(delivery)}


      </div>

    `;

  });

}


function getRiderActions(
  delivery
) {

  if (
    delivery.status ===
    "ASSIGNED"
  ) {

    return `

      <button
        onclick="updateStatus(
          ${delivery.id},
          'PICKED_UP'
        )"
      >

        📦 Mark as Picked Up

      </button>

    `;

  }


  if (
    delivery.status ===
    "PICKED_UP"
  ) {

    return `

      <button
        onclick="toggleConfirmBox(
          ${delivery.id}
        )"
      >

        ✓ Confirm Delivery

      </button>

    `;

  }


  if (
    delivery.status ===
    "DELIVERED"
  ) {

    return `

      <span class="completed-tag">
        ✓ Delivery Completed
      </span>

    `;

  }


  return "";

}


function getConfirmBox(delivery) {

  if (delivery.status !== "PICKED_UP") {
    return "";
  }

  return `
    <div class="confirm-box" id="confirm-box-${delivery.id}">
      <p class="hint">Enter the confirmation code the customer was given.</p>
      <div class="row">
        <input
          type="text"
          maxlength="8"
          placeholder="e.g. A1B2C3D4"
          id="confirm-input-${delivery.id}"
        >
        <button onclick="confirmDelivery(${delivery.id})">Submit</button>
      </div>
      <p class="code-error" id="confirm-error-${delivery.id}"></p>
    </div>
  `;

}


function toggleConfirmBox(deliveryId) {

  const box =
    document.getElementById(`confirm-box-${deliveryId}`);

  if (!box) return;

  box.classList.toggle("visible");

  if (box.classList.contains("visible")) {

    const input =
      document.getElementById(`confirm-input-${deliveryId}`);

    if (input) input.focus();

  }

}


async function updateStatus(
  deliveryId,
  status
) {

  const response =
    await fetch(

      `/api/deliveries/${deliveryId}/status`,

      {

        method:
          "PATCH",

        headers: {

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify({

            status

          })

      }

    );


  const result =
    await response.json();


  if (
    !response.ok
  ) {

    alert(
      result.error
    );

    return;

  }


  showToast(`Delivery #${deliveryId} marked as picked up`);


  loadDeliveries();

}


async function confirmDelivery(
  deliveryId
) {

  const input =
    document.getElementById(`confirm-input-${deliveryId}`);

  const errorEl =
    document.getElementById(`confirm-error-${deliveryId}`);

  const code =
    input ? input.value.trim() : "";


  if (!code) {

    if (input) input.focus();

    return;

  }

  if (errorEl) {
    errorEl.classList.remove("visible");
    errorEl.textContent = "";
  }


  const response =
    await fetch(

      `/api/deliveries/${deliveryId}/confirm`,

      {

        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify({

            confirmationCode:

              code
                .trim()
                .toUpperCase()

          })

      }

    );


  const result =
    await response.json();


  if (
    !response.ok
  ) {

    if (errorEl) {
      errorEl.textContent = result.error;
      errorEl.classList.add("visible");
    } else {
      alert(result.error);
    }

    return;

  }


  showToast(`Delivery #${deliveryId} delivered ✓`);


  loadDeliveries();

}


function connectToEvents() {

  const events =
    new EventSource(
      "/api/events"
    );

  events.onopen = () => setLiveOn();
  events.onerror = () => setLiveOff();


  [
    "delivery-created",
    "delivery-assigned",
    "status-updated",
    "delivery-confirmed"
  ].forEach((eventName) => {

    events.addEventListener(

      eventName,

      () => {

        loadDeliveries();

      }

    );

  });

}


async function startApp() {

  await loadRiders();

  await loadDeliveries();

  connectToEvents();

}


startApp();