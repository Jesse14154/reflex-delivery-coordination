const deliveryForm =
  document.getElementById("deliveryForm");

const retailerDeliveries =
  document.getElementById("retailerDeliveries");

const formBanner =
  document.getElementById("formBanner");

const submitDeliveryBtn =
  document.getElementById("submitDeliveryBtn");

const retailerCount =
  document.getElementById("retailerCount");

const deliverySearch =
  document.getElementById("deliverySearch");

const statusFilters =
  document.getElementById("statusFilters");


let allDeliveries = [];
let activeFilter = "ALL";


function showBanner(type, html) {
  formBanner.className = `form-banner visible ${type}`;
  formBanner.innerHTML = html;
}

function hideBanner() {
  formBanner.className = "form-banner";
  formBanner.innerHTML = "";
}


async function loadDeliveries() {

  try {

    const response =
      await fetch("/api/deliveries");

    allDeliveries =
      await response.json();

    renderDeliveries();

  } catch (error) {

    retailerDeliveries.innerHTML =
      "<p class=\"empty-note\">Unable to load deliveries.</p>";

  }

}


function renderDeliveries() {

  retailerCount.textContent = allDeliveries.length;

  const query = deliverySearch.value.trim().toLowerCase();

  const filtered = allDeliveries.filter((delivery) => {

    const matchesFilter =
      activeFilter === "ALL" || delivery.status === activeFilter;

    const matchesSearch =
      !query ||
      delivery.customer_name.toLowerCase().includes(query) ||
      delivery.customer_phone.toLowerCase().includes(query) ||
      String(delivery.id).includes(query);

    return matchesFilter && matchesSearch;

  });


  retailerDeliveries.innerHTML = "";


  if (allDeliveries.length === 0) {

    retailerDeliveries.innerHTML =
      "<p class=\"empty-note\">No deliveries created yet.</p>";

    return;

  }

  if (filtered.length === 0) {

    retailerDeliveries.innerHTML =
      "<p class=\"empty-note\">No deliveries match your search or filter.</p>";

    return;

  }


  filtered.forEach((delivery) => {

    const riderName =
      delivery.rider_name ||
      "Not Assigned";

    const isDelivered =
      delivery.status === "DELIVERED";

    const deliveredTimeRow =
      isDelivered
        ? `<div class="time-item"><span class="time-icon">✅</span><strong>Delivered</strong> ${formatDateTime(delivery.updated_at)}</div>`
        : "";


    retailerDeliveries.innerHTML += `

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


        <p>
          <strong>Assigned Rider</strong>
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


deliverySearch.addEventListener("input", renderDeliveries);

statusFilters.addEventListener("click", (event) => {

  const btn = event.target.closest(".filter-chip");
  if (!btn) return;

  statusFilters.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.classList.remove("active");
  });

  btn.classList.add("active");
  activeFilter = btn.dataset.filter;

  renderDeliveries();

});


deliveryForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    hideBanner();


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


    submitDeliveryBtn.disabled = true;
    submitDeliveryBtn.textContent = "Creating…";


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

        showBanner("error", result.error);

        return;

      }


      showBanner(
        "success",
        `Delivery created successfully. Confirmation code:
         <span class="code-chip">${result.confirmation_code}</span>
         — share this with your customer.`
      );


      deliveryForm.reset();


      loadDeliveries();


    } catch (error) {

      showBanner("error", "Unable to create delivery.");

    } finally {

      submitDeliveryBtn.disabled = false;
      submitDeliveryBtn.textContent = "Create Delivery";

    }

  }
);


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

        if (payload && payload.id) {
          const labels = {
            "delivery-created": `New delivery #${payload.id} created`,
            "delivery-assigned": `Delivery #${payload.id} assigned to a rider`,
            "status-updated": `Delivery #${payload.id} is now ${payload.status}`,
            "delivery-confirmed": `Delivery #${payload.id} delivered ✓`
          };
          if (labels[eventName]) showToast(labels[eventName]);
        }

        loadDeliveries();

      }

    );

  });

}


loadDeliveries();

connectToEvents();