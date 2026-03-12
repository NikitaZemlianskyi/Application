# Event Management System - Proof of Concept (PoC)

This is a Proof of Concept (PoC) for a simplified Event Management Application. It allows users to browse public events, register, create their own events, and manage their schedules.

## 🚀 Tech Stack

**Frontend:**
* React + TypeScript 
* State Management (Zustand)
* Styling with Tailwind CSS

**Backend:**
* NestJS
* PostgreSQL database 
* TypeORM
* JWT Authentication

**Infrastructure:**
* Docker & Docker Compose

## ✨ Features

* **User Authentication:** Sign up and log in using email and password with secure hashing and JWT-based session management.
* **Public Events:** View a list of public events and check details like date, location, capacity, and current participants.
* **Event Participation:** Join or leave events (unless the event is full).
* **Event Creation & Management:** Authenticated users can create public or private events. Organizers can edit or delete their events.
* **My Events Calendar:** A calendar view (monthly and weekly) showing events where the user is a participant or organizer.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your machine:
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [Git](https://git-scm.com/install) (optional)

## ⚙️ Environment Variables

Create a `.env` file in the root directory of the project. You can copy the contents from a `.env.example` file if provided. Below is the list of required environment variables:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `DB_USER` | PostgreSQL database user | `admin` |
| `DB_PASSWORD` | PostgreSQL database password | `secret_password` |
| `DB_NAME` | PostgreSQL database name | `event_db` |
| `DB_PORT` | Port exposed for the database | `5432` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super_secret_jwt_key` |
| `PORT` | Port for the Backend API | `3000` |

*Note: The Frontend expects the backend API to be available at `http://localhost:${PORT}`.*

## 🚀 Getting Started

Launch the project automatically with one command.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NikitaZemlianskyi/Application.git
   cd Application

2. **Launch the entire project with one command:**
   ```bash
   docker-compose up --build

3. **Access the application:**
   ```bash
   Frontend App: http://localhost:8080
   Backend API: http://localhost:3000
   Swagger Docs: http://localhost:3000/api

## Default Credentials (Seeded Data)

The database is automatically seeded with sample data on the first launch. You can log in with:

| Email | Password
| :--- | :--- |
| eduard@test.com | password123 |
| alice@test.com | password123 |