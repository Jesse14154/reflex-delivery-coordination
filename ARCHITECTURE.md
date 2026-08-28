# Reflex System Architecture

## 1. Overview

Reflex is a delivery coordination system designed for small Kenyan retailers who currently manage deliveries through phone calls and WhatsApp messages.

The system provides a structured delivery workflow where:

1. Retailer staff create delivery requests.
2. Dispatchers view open delivery requests.
3. Dispatchers assign deliveries to riders.
4. Riders view their assigned deliveries.
5. Riders update the delivery status.
6. Riders confirm delivery using a confirmation code.
7. Retailers can monitor the delivery progress.

The architecture separates the user interface, application logic and data storage.

---

# 2. Technology Stack

## Frontend

The frontend uses:

* HTML
* CSS
* JavaScript

The frontend is separated into three role-based dashboards:

* Retailer Dashboard
* Dispatcher Dashboard
* Rider Dashboard

This separation reduces clutter and ensures that each user sees only the actions relevant to their role.

---

## Backend

The backend uses:

* Node.js
* Express.js

Express provides the REST API used by the frontend to create deliveries, retrieve deliveries, assign riders and update delivery status.

---

## Database

The system uses SQLite.

SQLite stores information about:

* Deliveries
* Riders
* Delivery assignments
* Delivery status
* Confirmation codes

SQLite was selected because it is lightweight, easy to set up and appropriate for demonstrating the MVP without requiring a separate database server.

---

## Real-Time Updates

The system uses Server-Sent Events.

When an important delivery event occurs, the server notifies connected dashboards.

Examples include:

* Delivery created
* Rider assigned
* Delivery status updated
* Delivery confirmed

The dashboards then reload the latest delivery information.

---

# 3. System Architecture

The Reflex system follows a three-layer architecture.

## Presentation Layer

The presentation layer consists of the web pages used by the three personas.

Retailer:

Creates delivery requests and monitors delivery progress.

Dispatcher:

Views open deliveries and assigns riders.

Rider:

Views assigned deliveries and updates delivery status.

---

## Application Layer

The application layer is the Node.js and Express server.

The server:

* Receives requests from the dashboards.
* Validates delivery actions.
* Updates the database.
* Generates confirmation codes.
* Controls delivery status changes.
* Sends real-time events to connected dashboards.

---

## Data Layer

The SQLite database stores the persistent delivery information.

The database allows delivery information to remain available even when the browser is refreshed.

---

# 4. Delivery Workflow

The normal delivery workflow is:

OPEN

↓

ASSIGNED

↓

PICKED_UP

↓

DELIVERED

A delivery cannot be completed immediately without first being assigned and picked up.

This structured workflow helps prevent invalid delivery updates.

---

# 5. Assignment Flow

1. A retailer creates a delivery.
2. The delivery is stored with an OPEN status.
3. The dispatcher views the open delivery.
4. The dispatcher selects a rider.
5. The server records the rider assignment.
6. The delivery status changes to ASSIGNED.
7. The assigned rider can see the delivery in the Rider Dashboard.

---

# 6. Delivery Confirmation Flow

When a delivery is created, the system generates a confirmation code.

The rider must enter the correct confirmation code when confirming delivery.

The server validates the confirmation code before changing the delivery status to DELIVERED.

This provides a basic proof-of-delivery mechanism in the MVP.

---

# 7. Real-Time Update Flow

When a delivery event occurs:

1. A user performs an action.
2. The frontend sends a request to the Express server.
3. The server validates the request.
4. The SQLite database is updated.
5. The server publishes a Server-Sent Event.
6. Connected dashboards receive the event.
7. The dashboards reload the latest information.

This reduces the need for users to manually refresh their pages.
