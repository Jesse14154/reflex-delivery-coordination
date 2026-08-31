# Reflex System Architecture

## Overview

Reflex is a role-based delivery coordination system.

The architecture supports a structured workflow between:

* Retailer
* Dispatcher
* Rider

The system allows delivery information to move through a central backend while connected dashboards receive updated information as delivery events occur.

The core architecture is:

```text
Retailer
    │
    ▼
Express API
    │
    ▼
SQLite Database
    │
    ├──────────────────► Dispatcher
    │
    ├──────────────────► Rider
    │
    ▼
Server-Sent Events
    │
    ▼
Live Dashboard Updates
```

---

# 1. User Roles

## Retailer

The Retailer creates and monitors delivery requests.

A retailer provides:

* Customer name.
* Customer phone number.
* Delivery address.
* Item description.

When a delivery is created, the system stores it with the initial status:

```text
OPEN
```

The system also generates a confirmation code used later to verify delivery completion.

---

## Dispatcher

The Dispatcher coordinates delivery assignment.

The Dispatcher can:

1. View OPEN delivery requests.
2. View available riders.
3. Select a rider.
4. Assign the rider to the delivery.

After assignment, the delivery status becomes:

```text
ASSIGNED
```

---

## Rider

The Rider manages the physical delivery process.

The Rider can:

1. Select their rider profile.
2. View assigned deliveries.
3. Mark a delivery as picked up.
4. Confirm delivery using the confirmation code.

The delivery workflow is:

```text
ASSIGNED
    ↓
PICKED_UP
    ↓
DELIVERED
```

---

# 2. Frontend Architecture

The frontend is built using:

* HTML
* CSS
* Vanilla JavaScript

The application separates users into dedicated dashboards:

```text
public/

├── index.html
├── retailer.html
├── dispatcher.html
├── rider.html
├── style.css
├── retailer.js
├── dispatcher.js
├── rider.js
└── realtime.js
```

---

## Homepage

The homepage introduces the Reflex platform and provides navigation to the three role-based dashboards.

It includes an animated visualisation of the delivery journey:

```text
Retailer
   ↓
Delivery Created
   ↓
Dispatcher
   ↓
Rider
   ↓
Customer
```

This animation is a frontend presentation feature and does not interact with the backend.

---

## Role-Based Dashboards

Each role has a dedicated dashboard.

This separation reduces unnecessary interface complexity.

For example:

* Retailers focus on creating and monitoring deliveries.
* Dispatchers focus on assignment and coordination.
* Riders focus on their assigned delivery actions.

---

# 3. Backend Architecture

The backend uses:

* Node.js
* Express.js

The backend acts as the central coordination layer.

Its responsibilities include:

* Receiving delivery requests.
* Returning delivery data.
* Returning rider data.
* Assigning riders.
* Updating delivery status.
* Confirming deliveries.
* Publishing delivery events.

The frontend communicates with the backend through HTTP requests and receives live delivery events through Server-Sent Events.

---

# 4. Database Architecture

Reflex uses SQLite for persistent storage.

The database stores information about:

## Riders

Rider information includes:

* Rider ID.
* Rider name.

## Deliveries

Delivery information includes:

* Delivery ID.
* Customer name.
* Customer phone number.
* Delivery address.
* Item description.
* Delivery status.
* Assigned rider.
* Confirmation code.
* Created timestamp.
* Updated timestamp.

---

# 5. Delivery Workflow

The delivery lifecycle follows controlled state transitions.

```text
┌───────────────┐
│ Retailer      │
│ Creates Order │
└───────┬───────┘
        │
        ▼
      OPEN
        │
        │ Dispatcher assigns rider
        ▼
    ASSIGNED
        │
        │ Rider collects item
        ▼
   PICKED_UP
        │
        │ Rider enters confirmation code
        ▼
    DELIVERED
```

Each state represents the current stage of the delivery.

The use of explicit statuses makes delivery progress easier to understand and display across all dashboards.

---

# 6. API Communication

The frontend communicates with the backend using HTTP requests.

Examples include:

```text
POST /api/deliveries
GET  /api/deliveries
GET  /api/riders
```

The delivery workflow also includes API operations for:

* Assigning riders.
* Retrieving rider deliveries.
* Updating delivery status.
* Confirming delivery.

The frontend preserves the API contract between the existing JavaScript and backend.

---

# 7. Real-Time Architecture

## Server-Sent Events

Reflex uses Server-Sent Events (SSE) to provide server-to-browser delivery updates.

The frontend connects to:

```text
/api/events
```

using the browser's:

```text
EventSource
```

API.

The system listens for events including:

```text
delivery-created
delivery-assigned
status-updated
delivery-confirmed
```

When an event is received, the frontend reloads the latest delivery information.

This keeps connected dashboards synchronised with changes happening elsewhere in the delivery workflow.

---

# 8. Role of `realtime.js`

The file:

```text
public/realtime.js
```

supports frontend real-time behaviour and shared user interface features.

It is loaded by the dashboard pages.

Its purpose is to provide reusable real-time presentation functionality, such as:

* Live connection indicators.
* Delivery update notifications.
* Shared real-time user feedback.

The role-specific JavaScript files continue to manage their own dashboard data and workflow actions.

This separation keeps the shared real-time user experience separate from role-specific delivery functionality.

---

# 9. Why Server-Sent Events Were Used

The current system mainly needs one-way communication:

```text
Server
   ↓
Dashboard
```

When delivery information changes, the server notifies connected dashboards.

Users continue to send actions such as:

* Creating deliveries.
* Assigning riders.
* Updating delivery status.

through normal HTTP requests.

SSE therefore provides a simpler model for the current MVP than introducing full two-way WebSocket communication.

---

# 10. System Data Flow

The overall flow is:

```text
1. Retailer creates delivery
            │
            ▼
2. Backend stores delivery
            │
            ▼
3. Delivery event is published
            │
            ▼
4. Connected dashboards receive update
            │
            ▼
5. Dispatcher assigns rider
            │
            ▼
6. Backend updates database
            │
            ▼
7. Delivery event is published
            │
            ▼
8. Rider dashboard receives updated information
            │
            ▼
9. Rider updates delivery progress
            │
            ▼
10. Connected dashboards receive the latest status
```

---

# 11. Architectural Strengths

The current architecture provides:

* Clear separation of user roles.
* Centralised delivery coordination.
* Persistent delivery storage.
* Simple REST communication.
* Live server-to-client updates.
* A clear delivery state model.
* A lightweight technology stack.
* Low infrastructure complexity.

---

# 12. Architectural Limitations

The current MVP also has limitations.

These include:

* SQLite is not designed for large distributed production workloads.
* Server-Sent Events provide limited two-way communication.
* The current MVP does not provide full authentication.
* Role-based pages are not the same as production-grade access control.
* The application does not currently include live GPS tracking.
* Advanced failure recovery and monitoring would be required for production.

These limitations are documented further in:

```text
TRADEOFFS.md
```

and:

```text
ROADMAP.md
```

---

# Conclusion

Reflex uses a lightweight architecture designed to validate the core delivery coordination workflow.

The system combines:

* Role-based dashboards.
* Express API communication.
* SQLite persistence.
* Controlled delivery states.
* Server-Sent Event updates.

This approach prioritises simplicity and rapid MVP development while creating a foundation that can later be extended with stronger security, scalability, and operational capabilities.
s