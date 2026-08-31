# ⚡ Reflex Delivery Coordination System

> ## Every Delivery. Every Move. In Sync.

## Overview

Reflex is a role-based delivery coordination system designed to help coordinate deliveries through one central workflow.

The platform connects three key roles:

**🏪 Retailer → 📋 Dispatcher → 🛵 Rider**

Instead of relying entirely on phone calls and informal communication, Reflex provides a structured system where deliveries can be created, assigned, tracked, and confirmed.

The system also provides live updates so delivery changes can be communicated across connected dashboards.

---

# The Problem

Delivery coordination can become difficult when different people rely on separate phone calls, messages, and informal communication.

This can create problems such as:

* Unclear responsibility for deliveries.
* Difficulty tracking delivery progress.
* Dispatchers struggling to monitor open delivery requests.
* Riders lacking a clear view of assigned deliveries.
* Retailers having limited visibility into delivery completion.
* Limited accountability and delivery history.

Reflex addresses this problem by bringing the delivery workflow into one coordinated system.

---

# The Solution

Reflex provides separate workspaces for each role while keeping all delivery information connected through one central system.

The delivery workflow is:

```text
🏪 Retailer
Create Delivery
      ↓
OPEN
      ↓
📋 Dispatcher
Assign Rider
      ↓
ASSIGNED
      ↓
🛵 Rider
Mark as Picked Up
      ↓
PICKED UP
      ↓
🛵 Rider
Confirm Delivery
      ↓
DELIVERED
      ↓
🏪 Retailer
Views Final Delivery Status
```

---

# Key Features

## 🏪 Retailer Dashboard

The Retailer can:

* Create a new delivery.
* Enter customer details.
* Enter a customer phone number.
* Enter a delivery address.
* Enter an item description.
* Receive a confirmation code.
* View created deliveries.
* Monitor delivery progress.
* View the assigned rider.

---

## 📋 Dispatcher Dashboard

The Dispatcher can:

* View all deliveries.
* Identify OPEN delivery requests.
* View available riders.
* Select a rider.
* Assign a rider to a delivery.
* Monitor delivery status changes.

---

## 🛵 Rider Dashboard

The Rider can:

* Select a rider profile.
* View assigned deliveries.
* View customer information.
* View the delivery address.
* View item information.
* Mark an assigned delivery as `PICKED UP`.
* Enter a confirmation code.
* Confirm delivery completion.

---

# ⚡ Real-Time Updates

Reflex uses **Server-Sent Events (SSE)** to provide live updates from the server to connected dashboards.

The frontend connects to the event endpoint:

```text
/api/events
```

using the browser's `EventSource` API.

The backend sends the following events:

```text
delivery-created
delivery-assigned
status-updated
delivery-confirmed
```

These events are triggered when important delivery actions occur.

The frontend can use these events to refresh delivery information and update the user interface without requiring the user to manually reload the page.

The application also includes a **Live Updates** indicator as part of the frontend experience.

---

# 🎨 Modern User Interface

The Reflex frontend was redesigned to create a more professional and presentation-ready experience.

The interface includes:

* Modern logistics-inspired design.
* Separate dashboards for each user role.
* Professional navigation.
* Responsive layouts.
* Delivery cards.
* Clear delivery status badges.
* Improved forms and buttons.
* Empty-state messages.
* Live update indicators.
* Delivery update feedback.
* Responsive design for smaller screens.

---

# 📦 Delivery Journey Animation

The Reflex homepage includes an animated visualisation of the delivery process.

The animation represents the journey:

```text
🏪 Retailer
      ↓
📦 Delivery Created
      ↓
📋 Dispatcher
      ↓
🛵 Rider
      ↓
🏠 Customer
```

The animation is a frontend presentation feature and helps visitors quickly understand the purpose of the Reflex system.

It does not affect the backend delivery workflow.

---

# Technology Stack

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript

## Backend

* Node.js
* Express.js

## Database

* SQLite

## Real-Time Communication

* Server-Sent Events (SSE)
* EventSource API

---

# Project Structure

```text
REFLEX/
│
├── public/
│   ├── index.html
│   ├── retailer.html
│   ├── dispatcher.html
│   ├── rider.html
│   ├── style.css
│   ├── retailer.js
│   ├── dispatcher.js
│   ├── rider.js
│   └── realtime.js
│
├── src/
│   ├── server.js
│   └── database.js
│
├── ARCHITECTURE.md
├── TRADEOFFS.md
├── ROADMAP.md
├── README.md
├── package.json
└── package-lock.json
```

---

# System Architecture

```text
                  REFLEX DELIVERY SYSTEM

   🏪 Retailer      📋 Dispatcher      🛵 Rider
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
                   Express REST API
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       SQLite Database       Server-Sent Events
                                        │
                                        ▼
                               Live Dashboard Updates
```

---

# Delivery Status Flow

Reflex uses controlled delivery status transitions:

```text
OPEN
  ↓
ASSIGNED
  ↓
PICKED UP
  ↓
DELIVERED
```

Each status represents a specific stage in the delivery process.

The system prevents invalid workflow transitions by checking the current delivery status before updating it.

---

# Real-Time Event Flow

When a delivery action occurs:

```text
User Action
     ↓
Express API
     ↓
SQLite Database Updated
     ↓
Server Sends SSE Event
     ↓
Connected Dashboards Receive Event
     ↓
Frontend Refreshes Relevant Data
```

This helps keep the delivery coordination workflow synchronised across users.

---

# Installation

## 1. Clone the Repository

```bash
git clone <your-repository-url>
```

## 2. Open the Project Folder

```bash
cd reflex-delivery-coordination
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Application

Use the project's development command:

```bash
npm run dev
```

The application will run locally using the port configured by:

```javascript
process.env.PORT || 3000
```

Open:

```text
http://localhost:3000
```

---

# Testing the Complete Workflow

## Step 1 — Create a Delivery

Open the **Retailer Dashboard**.

Enter:

* Customer name.
* Customer phone number.
* Delivery address.
* Item description.

Create the delivery.

Expected status:

```text
OPEN
```

A confirmation code is generated for the delivery.

---

## Step 2 — Assign a Rider

Open the **Dispatcher Dashboard**.

Find the OPEN delivery.

Select a rider and assign them to the delivery.

Expected status:

```text
ASSIGNED
```

---

## Step 3 — Pick Up the Delivery

Open the **Rider Dashboard**.

Select the assigned rider.

Find the assigned delivery.

Click:

```text
Mark as Picked Up
```

Expected status:

```text
PICKED UP
```

---

## Step 4 — Confirm Delivery

Enter the delivery confirmation code.

Confirm the delivery.

Expected final status:

```text
DELIVERED
```

---

## Step 5 — Verify Live Updates

Keep more than one dashboard open.

Perform actions such as:

* Creating a delivery.
* Assigning a rider.
* Marking a delivery as picked up.
* Confirming a delivery.

Verify that the connected dashboards receive the latest delivery information through the application's real-time event system.

---

# API Overview

## Riders

```text
GET /api/riders
```

Returns the available riders.

---

## Deliveries

```text
GET /api/deliveries
```

Returns delivery information.

```text
POST /api/deliveries
```

Creates a new delivery.

```text
POST /api/deliveries/:id/assign
```

Assigns a rider to an OPEN delivery.

```text
PATCH /api/deliveries/:id/status
```

Updates a delivery status according to the allowed workflow.

```text
POST /api/deliveries/:id/confirm
```

Confirms delivery using the delivery confirmation code.

```text
GET /api/deliveries/:id/history
```

Returns the status history for a delivery.

---

# Documentation

The project includes additional documentation:

## `ARCHITECTURE.md`

Explains:

* System structure.
* User roles.
* Delivery data flow.
* API communication.
* Database responsibilities.
* Real-time updates.

## `TRADEOFFS.md`

Explains important engineering decisions and trade-offs made during the MVP.

## `ROADMAP.md`

Explains possible future improvements needed to move Reflex from an MVP toward a production-ready system.

---

# MVP Limitations

Reflex is currently a Minimum Viable Product.

The current version does not yet include:

* Full user authentication.
* Production-grade role-based authorization.
* Cloud-hosted database infrastructure.
* Advanced monitoring and logging.
* Live GPS rider tracking.
* Customer notification services.
* Advanced production security controls.

These limitations provide opportunities for future development and scaling.

---

# Future Improvements

Possible future improvements include:

* User authentication.
* Role-based access control.
* Cloud-hosted database infrastructure.
* PostgreSQL migration.
* SMS and email notifications.
* Live rider location tracking.
* Delivery history dashboards.
* Operational analytics.
* Automated rider assignment.
* Route optimisation.
* Mobile applications for riders.

---

# Motto

> ## Every Delivery. Every Move. In Sync.

Reflex is built around one idea:

**Every person involved in a delivery should be connected to the same coordinated workflow.**
