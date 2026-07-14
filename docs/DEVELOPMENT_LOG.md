# Development Log

## Day 1 (26 June 2026)

### Work Completed

#### Project Initialization

* Created GitHub repository.
* Initialized local Git repository.
* Created project folder structure:

  * docs/
  * frontend/
  * backend/
  * database/
  * screenshots/

#### Requirement Analysis

* Understood project objectives and deliverables.
* Identified three main user roles:

  * Employee
  * Manager
  * HR Admin

#### Version 1 Scope (MVP)

Employee:

* Login
* Apply Leave
* View Leave Balance
* View Leave History

Manager:

* Approve/Reject Requests
* Add Comments
* Team Absence View

HR Admin:

* Employee Management
* Leave Types
* Holiday Management
* Reports

#### Documentation Created

* README.md
* SRS.md

### Important Decisions

Tech Stack:

* Frontend: HTML, CSS, JavaScript
* Backend: Django
* Database: SQLite (development), MySQL (production)

### Next Steps

* Create Use Case Diagram
* Create High-Level Design (HLD)
* Create ER Diagram
* Design Database Schema
* Prepare UI Wireframes

---

## Day 2 & 3 (July 2026)

### Work Completed

#### Tech Stack Transition (MERN Architecture)
* Re-aligned architecture to **MERN (React, Node.js/Express, MongoDB)** stack.
* Replaced initial HTML/CSS frontend with a modern **React + Vite + Tailwind CSS + shadcn/ui** project in `frontend/`.
* Swapped backend database design from SQLite/MySQL to **MongoDB Atlas (Mongoose ODM)** documents store.
* Created detailed `ARCHITECTURE.md`, `API_CONTRACT.md`, and `DATABASE_SCHEMA.md` detailing backend integration endpoints.

#### UI Redesign & High-Fidelity Redesign
* Redesigned application color palettes to use premium **Node.js Green** primary theme and **Dark Navy** sidebar theme matching the design board screenshots.
* Integrated **Inter Variable** font throughout.
* Rebuilt Login layout with two-column split design, interactive role selection, and dummy credentials auto-fill.
* Redesigned dashboard widgets: SVG Donut Leave Utilization charts, progress bars for leave balance tracks, and tab-filtered approvals tables.
* Rebuilt fully functional profile update page (`Profile.jsx`) simulating photo upload integrations.

#### Verification
* Ran build scripts verification, ensuring successful compilation with **0 errors and 0 warnings**.

