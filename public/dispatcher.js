const openDeliveries =
  document.getElementById(
    "openDeliveries"
  );

const allDeliveries =
  document.getElementById(
    "allDeliveries"
  );


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


  if (open.length === 0) {

    openDeliveries.innerHTML =
      "<p>No open deliveries.</p>";

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


  alert(
    "Rider assigned successfully!"
  );


  loadDeliveries();

}


function renderAllDeliveries() {

  allDeliveries.innerHTML = "";


  if (
    deliveries.length === 0
  ) {

    allDeliveries.innerHTML =
      "<p>No deliveries yet.</p>";

    return;

  }


  deliveries.forEach((delivery) => {

    const riderName =
      delivery.rider_name ||
      "Not Assigned";


    allDeliveries.innerHTML += `

      <div class="delivery-card">


        <h3>
          Delivery #${delivery.id}
        </h3>


        <p>
          <strong>Customer:</strong>
          ${delivery.customer_name}
        </p>


        <p>
          <strong>Status:</strong>

          <span
            class="status status-${delivery.status.toLowerCase()}"
          >

            ${delivery.status}

          </span>

        </p>


        <p>
          <strong>Rider:</strong>
          ${riderName}
        </p>


      </div>

    `;

  });

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