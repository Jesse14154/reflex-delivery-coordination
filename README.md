# ⚡ Reflex Delivery Coordination System

> **Every Delivery. Every Move. In Sync.**

## Overview

Reflex is a role-based delivery coordination system designed to help small retailers manage deliveries through one coordinated workflow.

The system connects three important roles:

**🏪 Retailer → 📋 Dispatcher → 🛵 Rider**

Instead of relying entirely on phone calls, WhatsApp messages, and informal coordination, Reflex provides a structured system where delivery requests can be created, assigned, tracked, and confirmed.

The platform also supports live delivery updates so users can see important delivery changes without manually refreshing their dashboard.

---

# The Problem

Small retailers may coordinate deliveries using phone calls, WhatsApp messages, and informal communication.

This creates several problems:

* It may be unclear who is responsible for a delivery.
* Delivery progress may not be visible.
* Dispatchers may struggle to track open requests.
* Riders may not have a clear view of their assigned deliveries.
* Retailers may not know whether a delivery has been completed.
* Informal communication provides limited delivery history and accountability.

Reflex addresses this problem by centralising delivery coordination into one structured workflow.

---

# The Solution

Reflex provides a role-based delivery coordination workflow.

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
Pick Up Delivery
      ↓
PICKED_UP
      ↓
🛵 Rider
Confirm Delivery
      ↓
DELIVERED
      ↓
🏪 Retailer
Views Final Delivery Status
```

Each role has a dedicated dashboard designed around the actions that role needs to perform.

---

# Key Features

## 🏪 Retailer Dashboard

Retailers can:

* Create new delivery requests.
* Enter customer name.
* Enter customer phone number.
* Enter delivery address.
* Enter item description.
* Receive a delivery confirmation code.
* View created deliveries.
* Search deliveries.
* Filter deliveries by status.
* View assigned riders.
* Monitor delivery progress.

---

## 📋 Dispatcher Dashboard

Dispatchers can:

* View OPEN delivery requests.
* View all deliveries.
* View delivery information.
* Select an available rider.
* Assign riders to deliveries.
* Monitor delivery status changes.

---

## 🛵 Rider Dashboard

Riders can:

* Select their rider profile.
* View assigned deliveries.
* View customer information.
* View delivery addresses.
* View item information.
* Mark deliveries as PICKED_UP.
* Confirm deliveries using a confirmation code.
* Complete deliveries as DELIVERED.

---

# ⚡ Real-Time Updates

Reflex supports real-time delivery updates using **Server-Sent Events (SSE)**.

The frontend connects to the backend event endpoint:

```text
/api/events
```

The system listens for important delivery events including:

```text
delivery-created
delivery-assigned
status-updated
delivery-confirmed
```

When an event is received, the relevant dashboard reloads the latest delivery data.

This means delivery changes can become visible across connected dashboards without requiring the user to manually refresh the page.

The frontend also displays a **Live Updates** indicator to show the status of the real-time connection.

---

# 🎨 Modern User Interface

The Reflex frontend was redesigned to create a more professional and presentation-ready experience.

The interface includes:

* Modern logistics-inspired design.
* Separate role-based dashboards.
* Professional navigation.
* Responsive layouts.
* Delivery cards.
* Clear status badges.
* Improved forms and buttons.
* Search and filtering controls.
* Empty states.
* Live update indicators.
* Delivery notification messages.
* Responsive design for smaller screens.

---

# 📦 Delivery Journey Animation

The Reflex homepage includes an animated visualisation of how a delivery moves through the platform.

The journey demonstrates:

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

The animation is decorative and does not interact with the backend.

Its purpose is to visually communicate the Reflex delivery workflow to users and presentation audiences.

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

# Application Architecture

```text
                    REFLEX PLATFORM

       🏪 Retailer     📋 Dispatcher     🛵 Rider
              │              │              │
              └──────────────┼──────────────┘
                             │
                             ▼
                      Express REST API
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
          SQLite Database        Server-Sent Events
                                          │
                                          ▼
                                  Live Dashboard Updates
```

---

# Installation

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

## 2. Open the project folder

```bash
cd reflex-delivery-coordination
```

## 3. Install dependencies

```bash
npm install
```

## 4. Start the application

Use the existing project command:

```bash
npm run dev
```

Open the application using the local address shown in the terminal.

---

# Testing the Complete Workflow

## Step 1 — Create a Delivery

Open the:

```text
Retailer Dashboard
```

Enter:

* Customer name
* Customer phone
* Delivery address
* Item description

Create the delivery.

Expected status:

```text
OPEN
```

A confirmation code should also be generated.

---

## Step 2 — Assign a Rider

Open the:

```text
Dispatcher Dashboard
```

Find the OPEN delivery.

Select a rider.

Click:

```text
Assign Rider
```

Expected status:

```text
ASSIGNED
```

---

## Step 3 — Pick Up the Delivery

Open the:

```text
Rider Dashboard
```

Select the assigned rider.

Find the delivery.

Click:

```text
Mark as Picked Up
```

Expected status:

```text
PICKED_UP
```

---

## Step 4 — Confirm the Delivery

Enter the delivery confirmation code.

Click the confirmation action.

Expected status:

```text
DELIVERED
```

---

## Step 5 — Verify Live Updates

Observe the connected dashboards.

When delivery events occur, the application should reload the latest delivery data through the real-time event connection.

Test the following events:

* Delivery created.
* Rider assigned.
* Delivery picked up.
* Delivery confirmed.

---

# Documentation

The project includes the following technical documentation:

## `ARCHITECTURE.md`

Explains:

* System structure.
* User roles.
* Data flow.
* API interaction.
* Database.
* Real-time updates.

## `TRADEOFFS.md`

Explains important engineering trade-offs and the limitations accepted during the MVP.

## `ROADMAP.md`

Explains how Reflex could evolve from the current MVP into a more secure and scalable production system.

---

# MVP Limitations

Reflex is currently an MVP.

The current version does not yet include:

* Full user authentication.
* Production-grade role-based authorization.
* Cloud database infrastructure.
* Advanced monitoring.
* Live GPS rider tracking.
* Customer notification services.
* Production-scale security controls.

These limitations are intentional MVP trade-offs and are documented in the project roadmap and trade-off documentation.

---

# Future Improvements

Potential future improvements include:

* Secure user authentication.
* Role-based access control.
* PostgreSQL or managed cloud database.
* SMS and email notifications.
* Live rider location tracking.
* Delivery history.
* Operational analytics.
* Automated rider assignment.
* Route optimisation.
* Mobile rider applications.

---

# Motto

> **Every Delivery. Every Move. In Sync.**

Reflex is designed around the idea that every participant in the delivery process should have visibility into the same coordinated workflow.
