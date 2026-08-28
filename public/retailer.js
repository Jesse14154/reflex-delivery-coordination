const deliveryForm =
  document.getElementById("deliveryForm");

const retailerDeliveries =
  document.getElementById("retailerDeliveries");


async function loadDeliveries() {

  try {

    const response =
      await fetch("/api/deliveries");

    const deliveries =
      await response.json();


    retailerDeliveries.innerHTML = "";


    if (deliveries.length === 0) {

      retailerDeliveries.innerHTML =
        "<p>No deliveries created yet.</p>";

      return;

    }


    deliveries.forEach((delivery) => {

      const riderName =
        delivery.rider_name ||
        "Not Assigned";


      retailerDeliveries.innerHTML += `

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


          <p>
            <strong>Assigned Rider:</strong>
            ${riderName}
          </p>


        </div>

      `;

    });


  } catch (error) {

    retailerDeliveries.innerHTML =
      "<p>Unable to load deliveries.</p>";

  }

}


deliveryForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();


    const customerName =
      document.getElementById(
        "customerName"
      ).value;


    const customerPhone =
      document.getElementById(
        "customerPhone"
      ).value;


    const deliveryAddress =
      document.getElementById(
        "deliveryAddress"
      ).value;


    const itemDescription =
      document.getElementById(
        "itemDescription"
      ).value;


    try {

      const response =
        await fetch(
          "/api/deliveries",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              customerName,

              customerPhone,

              deliveryAddress,

              itemDescription

            })

          }
        );


      const result =
        await response.json();


      if (!response.ok) {

        alert(result.error);

        return;

      }


      alert(
        `Delivery created successfully!

Confirmation Code:
${result.confirmation_code}`
      );


      deliveryForm.reset();


      loadDeliveries();


    } catch (error) {

      alert(
        "Unable to create delivery."
      );

    }

  }
);


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


loadDeliveries();

connectToEvents();