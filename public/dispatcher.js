const openDeliveries =
  document.getElementById(
    "openDeliveries"
  );

const allDeliveries =
  document.getElementById(
    "allDeliveries"
  );

const openCount =
  document.getElementById("openCount");

const allCount =
  document.getElementById("allCount");


let deliveries = [];

let riders = [];


async function loadRiders() {

  const response =
    await fetch("/api/riders");

  riders =
    await response.json();

}


async function loadDeliveries() {

  const response =
    await fetch(
      "/api/deliveries"
    );

  deliveries =
    await response.json();


  renderOpenDeliveries();

  renderAllDeliveries();

}


function renderOpenDeliveries() {

  openDeliveries.innerHTML = "";


  const open =
    deliveries.filter(
      delivery =>
        delivery.status === "OPEN"
    );

  openCount.textContent = open.length;


  if (open.length === 0) {

    openDeliveries.innerHTML =
      "<p class=\"empty-note\">No open deliveries.</p>";

    return;

  }


  open.forEach((delivery) => {

    const riderOptions =
      riders.map((rider) => {

        return `

          <option
            value="${rider.id}"
          >

            ${rider.name}

          </option>

        `;

      }).join("");


    openDeliveries.innerHTML += `

      <div class="delivery-card">

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
        </div>


        <div class="actions">


          <select
            id="rider-${delivery.id}"
          >

            <option value="">
              Select Rider
            </option>

            ${riderOptions}

          </select>


          <button
            onclick="assignRider(
              ${delivery.id}
            )"
          >

            Assign Rider

          </button>


        </div>


      </div>

    `;

  });

}


async function assignRider(
  deliveryId
) {

  const riderId =
    document.getElementById(
      `rider-${deliveryId}`
    ).value;


  if (!riderId) {

    alert(
      "Please select a rider."
    );

    return;

  }


  const response =
    await fetch(

      `/api/deliveries/${deliveryId}/assign`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          riderId

        })

      }

    );


  const result =
    await response.json();


  if (!response.ok) {

    alert(
      result.error
    );

    return;

  }


  showToast(`Delivery #${deliveryId} assigned successfully!`);


  loadDeliveries();

}


function renderAllDeliveries() {

  allDeliveries.innerHTML = "";

  allCount.textContent = deliveries.length;


  if (
    deliveries.length === 0
  ) {

    allDeliveries.innerHTML =
      "<p class=\"empty-note\">No deliveries yet.</p>";

    return;

  }


  deliveries.forEach((delivery) => {

    const riderName =
      delivery.rider_name ||
      "Not Assigned";

    const isDelivered =
      delivery.status === "DELIVERED";

    const deliveredTimeRow =
      isDelivered
        ? `<div class="time-item"><span class="time-icon">✅</span><strong>Delivered</strong> ${formatDateTime(delivery.updated_at)}</div>`
        : "";


    allDeliveries.innerHTML += `

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
          <strong>Rider</strong>
          ${riderName}
        </p>

        <div class="timestamps">
          <div class="time-item"><span class="time-icon">🕒</span><strong>Booked</strong> ${formatDateTime(delivery.created_at)}</div>
          ${deliveredTimeRow}
        </div>


      </div>

    `;

  });

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

      (e) => {

        let payload = null;
        try { payload = JSON.parse(e.data); } catch (err) {}

        if (payload && payload.id && eventName === "delivery-created") {
          showToast(`New request: Delivery #${payload.id}`);
        }

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