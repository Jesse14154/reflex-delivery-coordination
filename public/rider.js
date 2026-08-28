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

      "<p>Select your rider profile to view deliveries.</p>";

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

      "<p>You currently have no assigned deliveries.</p>";

    return;

  }


  riderItems.forEach((delivery) => {

    riderDeliveries.innerHTML += `

      <div class="delivery-card">


        <h3>
          Delivery #${delivery.id}
        </h3>


        <p>
          <strong>Customer:</strong>
          ${delivery.customer_name}
        </p>


        <p>
          <strong>Phone:</strong>
          ${delivery.customer_phone}
        </p>


        <p>
          <strong>Address:</strong>
          ${delivery.delivery_address}
        </p>


        <p>
          <strong>Item:</strong>
          ${delivery.item_description}
        </p>


        <p>
          <strong>Status:</strong>

          <span
            class="status status-${delivery.status.toLowerCase()}"
          >

            ${delivery.status}

          </span>

        </p>


        <div class="actions">

          ${getRiderActions(delivery)}

        </div>


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
        onclick="confirmDelivery(
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

      <strong>

        ✓ Delivery Completed

      </strong>

    `;

  }


  return "";

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


  alert(
    "Delivery marked as picked up!"
  );


  loadDeliveries();

}


async function confirmDelivery(
  deliveryId
) {

  const code =
    prompt(
      "Enter the delivery confirmation code:"
    );


  if (!code) {

    return;

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

    alert(
      result.error
    );

    return;

  }


  alert(
    "Delivery successfully confirmed!"
  );


  loadDeliveries();

}


function connectToEvents() {

  const events =
    new EventSource(
      "/api/events"
    );


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