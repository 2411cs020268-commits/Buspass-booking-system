# Bus Ticket Booking System

A polished full-stack bus ticket booking platform built with Spring Boot for the backend and React + Vite for the frontend.

![Bus Ticket Booking System Screenshot](bus_ticket_booking_system_frontend/bus_ticket_booking_system/src/assets/hero.png)

## 🚀 Project Overview

This project enables users to:

- search and book bus rides
- select seats and pay securely
- view booking history and ticket details
- manage users and admin functions

The backend is powered by Spring Boot with JWT security, and the frontend is built with React and Vite.

## ✨ Features

- Bus search and filtering
- Seat selection grid
- User authentication and registration
- Admin dashboard for bus and booking management
- PDF ticket generation and download
- Responsive React UI

## 🧱 Technology Stack

- Java + Spring Boot
- Maven build system
- React
- Vite
- JWT authentication
- REST API backend
- CSS for styling

## 📁 Repository Structure

- `bus_ticket_booking_system/` - additional backend folder (not currently used as main root)
- `bus_ticket_booking_system_frontend/bus_ticket_booking_system/` - main application directory
  - `src/main/java/` - Spring Boot backend source code
  - `src/main/resources/` - backend configuration files
  - `src/` - React frontend source code
  - `public/` - frontend static assets
  - `target/` - generated Maven build output
  - `pom.xml` - Maven configuration
  - `package.json` - frontend dependency configuration

## ✅ Prerequisites

- Java JDK 17 or newer
- Maven installed, or use the bundled wrapper (`mvnw` / `mvnw.cmd`)
- Node.js 16 or newer
- npm installed

## 🛠️ Setup Instructions

### 1. Backend

Open a terminal at:

```powershell
bus_ticket_booking_system_frontend/bus_ticket_booking_system
```

Build and run the backend:

```powershell
./mvnw clean package
./mvnw spring-boot:run
```

If Maven is installed globally:

```powershell
mvn clean package
mvn spring-boot:run
```

The backend will usually start at:

```text
http://localhost:8080
```

### 2. Frontend

In the same directory, install dependencies and start the frontend:

```powershell
npm install
npm run dev
```

Open the displayed URL in your browser (commonly `http://localhost:5173`).

## 🔄 Running Both Together

1. Start the backend first with Maven.
2. Start the frontend with `npm run dev`.
3. Use the frontend UI to access the backend services.

## 📦 Build and Clean

Build backend:

```powershell
./mvnw clean package
```

Clean Maven build artifacts:

```powershell
./mvnw clean
```

## 💡 Useful Commands

- `npm install` - install frontend dependencies
- `npm run dev` - start frontend dev server
- `./mvnw clean package` - build backend
- `./mvnw spring-boot:run` - run backend locally
- `./mvnw clean` - remove build artifacts

## 📝 Notes

- The repository contains generated Maven `target/` files. To remove them, run `./mvnw clean`.
- The frontend and backend are colocated under `bus_ticket_booking_system_frontend/bus_ticket_booking_system/`.

## 📌 License

Add your preferred license information here.
