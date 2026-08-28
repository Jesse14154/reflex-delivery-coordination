# ⚡ Reflex Delivery Coordination System

## Overview

Reflex is a role-based delivery coordination system designed to make the delivery process easier for small retailers.

The system provides separate dashboards for three main users:

* 🏪 Retailer Staff
* 📋 Dispatchers
* 🛵 Riders

Each user has a dedicated section of the system containing the actions relevant to their role.

---

# The Problem

Small retailers may coordinate deliveries using phone calls, WhatsApp messages and informal communication.

This can make it difficult to:

* Track delivery progress.
* Know which rider is responsible for a delivery.
* Monitor delivery status.
* Confirm that an item has been successfully delivered.

Reflex provides a centralised workflow for coordinating deliveries.

---

# The Solution

Reflex allows users to manage a delivery through a structured workflow:

```text
Retailer Creates Delivery
        ↓
Delivery Status: OPEN
        ↓
Dispatcher Assigns Rider
        ↓
Delivery Status: ASSIGNED
        ↓
Rider Picks Up Item
        ↓
Delivery Status: PICKED_UP
        ↓
Rider Confirms Delivery
        ↓
Delivery Status: DELIVERED
```

---

# Features

## 🏪 Retailer Dashboard

Retailers can:

* Create new delivery requests.
* Enter customer details.
* Enter delivery addresses.
* Add item descriptions.
* View delivery progress.
* View the assigned rider.
* Receive a delivery confirmation code.

---

## 📋 Dispatcher Dashboard

Dispatchers can:

* View open delivery requests.
* View all deliveries.
* Select available riders.
* Assign riders to deliveries.
* Monitor delivery status.

---

## 🛵 Rider Dashboard

Riders can:

* Select their rider profile.
* View deliveries assigned to them.
* View customer and delivery details.
* Mark deliveries as picked up.
* Confirm completed deliveries using a confirmation code.

---

# Technology Stack

## Frontend

* HTML
* CSS
* JavaScript

The frontend is divided into role-based pages:

```text
public/
├── index.html
├── retailer.html
├── dispatcher.html
├── rider.html
├── style.css
├── retailer.js
├── dispatcher.js
└── rider.js
```

---

## Backend

* Node.js
* Express.js

The backend provides the API used to manage deliveries and riders.

---

## Database

* SQLite

SQLite stores delivery and rider information.

---

## Real-Time Updates

Reflex uses Server-Sent Events (SSE).

When an important delivery event occurs, connected dashboards are notified and can refresh the latest delivery information.

Events include:

* Delivery created.
* Rider assigned.
* Delivery status updated.
* Delivery confirmed.

---

# System Architecture

```text
                 REFLEX WEB APPLICATION

        Retailer        Dispatcher        Rider
            │               │               │
            └───────────────┼───────────────┘
                            │
                            ▼
                     Express REST API
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
          SQLite Database       Server-Sent Events
                │                       │
                └───────────┬───────────┘
                            │
                            ▼
                    Updated Dashboards
```

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
│   └── rider.js
│
├── src/
│   ├── server.js
│   └── database.js
│
├── ARCHITECTURE.md
├── TRADEOFFS.md
├── ROADMAP.md
├── package.json
└── package-lock.json
```

---

# Installation

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

## 2. Open the project

```bash
cd reflex-delivery-coordination
```

## 3. Install dependencies

```bash
npm install
```

## 4. Start the application

```bash
npm run dev
```

The application should run at:

```text
http://localhost:3000
```

---

# Testing the Delivery Workflow

## Step 1: Create a Delivery

Open the Retailer Dashboard.

Create a new delivery by entering:

* Customer name.
* Customer phone number.
* Delivery address.
* Item description.

The system creates the delivery with an:

```text
OPEN
```

status.

A confirmation code is generated.

---

## Step 2: Assign a Rider

Open the Dispatcher Dashboard.

Find the delivery under:

```text
Open Delivery Requests
```

Select a rider.

Click:

```text
Assign Rider
```

The delivery status becomes:

```text
ASSIGNED
```

---

## Step 3: Pick Up the Delivery

Open the Rider Dashboard.

Select the rider assigned to the delivery.

Find the assigned delivery.

Click:

```text
📦 Mark as Picked Up
```

The status becomes:

```text
PICKED_UP
```

---

## Step 4: Confirm Delivery

Click:

```text
✓ Confirm Delivery
```

Enter the delivery confirmation code.

If the code is correct, the delivery status becomes:

```text
DELIVERED
```

---

# Architecture Documentation

Additional technical documentation is available in:

* `ARCHITECTURE.md`
* `TRADEOFFS.md`
* `ROADMAP.md`

These documents explain:

* The system architecture.
* Engineering decisions.
* Technical trade-offs.
* Future improvements.
* The production roadmap.

---

# Future Improvements

Potential future improvements include:

* User authentication.
* Role-based authorization.
* PostgreSQL database migration.
* SMS notifications.
* Rider location tracking.
* Delivery history.
* Operational reporting.
* Automated rider assignment.
* Route optimisation.

---

# MVP Limitations

Reflex is currently an MVP.

The current version does not yet include production-level:

* Authentication.
* Authorization.
* Cloud infrastructure.
* Advanced security controls.
* Live rider GPS tracking.

These limitations are documented in the project trade-off and roadmap documentation.

---

# Conclusion

Reflex demonstrates a complete delivery coordination workflow between retailers, dispatchers and riders.

The MVP focuses on validating the core delivery process while keeping the architecture simple and understandable.

The project provides a foundation that can later be extended into a secure and scalable production delivery coordination platform.
