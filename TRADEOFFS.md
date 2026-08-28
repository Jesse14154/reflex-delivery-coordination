# Reflex MVP Trade-Off Log

## Trade-Off 1: SQLite Instead of a Cloud Database

### Decision

The Reflex MVP uses SQLite as its database instead of a cloud-hosted database such as PostgreSQL.

### Benefit

SQLite is lightweight, easy to set up and does not require a separate database server. This allowed the team to build and test the MVP quickly.

### Downside

SQLite is less suitable for a large production system with many concurrent users and distributed services.

### Why We Accepted This Trade-Off

The purpose of the current project is to demonstrate the delivery coordination workflow. SQLite provides enough persistence and functionality for an MVP while reducing infrastructure complexity.

### Future Improvement

A production version could migrate to PostgreSQL or another managed cloud database to improve scalability, reliability and concurrent access.

---

# Trade-Off 2: Server-Sent Events Instead of Full WebSockets

### Decision

The Reflex MVP uses Server-Sent Events to notify dashboards when delivery information changes.

### Benefit

Server-Sent Events provide a simple way for the server to send real-time updates to connected dashboards. They are easier to implement for the one-way update model required by the Reflex MVP.

### Downside

Server-Sent Events mainly support communication from the server to the client. They are less flexible than WebSockets for complex two-way real-time communication.

### Why We Accepted This Trade-Off

The MVP only needs the server to notify dashboards about delivery changes. Users already send actions to the server through normal HTTP requests.

Using WebSockets would introduce additional complexity without providing significant value for the current MVP requirements.

### Future Improvement

If Reflex later requires features such as real-time rider chat, live driver messaging or continuous location tracking, WebSockets could provide more flexible two-way communication.

---

# Trade-Off 3: Role-Based Pages Instead of Authentication

### Decision

The Reflex MVP separates the website into Retailer, Dispatcher and Rider dashboards but does not yet implement a full authentication and authorization system.

### Benefit

Separating the dashboards creates a clean and understandable user experience and allows the team to demonstrate role-specific workflows quickly.

### Downside

A user can manually navigate to another role's page. The current MVP therefore does not provide production-level access control.

### Why We Accepted This Trade-Off

The priority of the MVP was to validate the delivery workflow and role separation. Implementing secure authentication and authorization would require additional infrastructure and security testing.

### Future Improvement

A production version should implement secure user authentication and role-based authorization. Users would only be able to access dashboards and actions associated with their assigned role.

---

# Conclusion

The Reflex MVP intentionally prioritizes simplicity, rapid development and clear workflow demonstration.

The team accepts several limitations in the MVP because they reduce development complexity while still allowing the core delivery coordination process to be tested.

The identified trade-offs provide a clear roadmap for future improvements as Reflex moves toward a production-ready system.
