# Insta Mechanic (GARRAZO) - Project Overview

This file was generated to provide an overview of the "Insta Mechanic" project architecture, tech stack, and features.

## 1. Introduction
Insta Mechanic (also branded as GARRAZO) is an on-demand automotive repair service web application. It allows users facing car troubles to easily book certified mechanics who will come to their location for quick and reliable repairs.

## 2. Tech Stack

### Frontend
- **HTML5/CSS3/Vanilla JavaScript:** The application uses a single-page architecture built entirely with vanilla web technologies.
- **Dynamic Routing:** Page navigation is handled via custom JavaScript (`script.js`) which dynamically toggles the visibility of different sections (e.g., `#home-page`, `#services-page`, `#booking-page`).
- **Icons & Styling:** Uses FontAwesome for icons and a custom `styles.css` for layout and responsive design.

### Backend
- **Node.js & Express.js:** Serves as the core REST API framework.
- **Database:** Sequelize ORM configured with SQLite (`sqlite3`), making it lightweight and easy to set up.
- **Real-time Communication:** `socket.io` is integrated for real-time features (like updating the mechanic dashboard with new bookings).
- **Authentication & Security:** Uses `bcrypt` for password hashing and `jsonwebtoken` (JWT) for secure authentication.
- **File Uploads:** `multer` is included for handling file uploads.
- **Environment:** Managed using `dotenv`.

## 3. Project Structure
The repository is split into two main directories:

### `/Frontend`
- `index.html`: The main entry point containing all the UI sections (Home, Services, Booking, Login, Dashboard, About, Contact).
- `styles.css`: Contains all styling for the application.
- `script.js`: Handles all client-side logic, including navigation (`navigateTo`), tab switching, form submissions, and API interactions.

### `/Backend`
- `src/server.js`: The entry point for the backend application, setting up Express, Socket.io, routing, and database connections.
- `src/utils/`: Contains utility functions, including database initialization and socket setup.
- `src/routes/`: Express routers defining API endpoints.
- `src/models/`: Sequelize database models for entities like Users, Bookings, etc.
- `src/middlewares/`: Custom Express middlewares (e.g., auth verification).
- `src/seed.js`: A script for seeding initial data into the database.
- `.env.example`: A template for required environment variables.
- `package.json`: Backend dependencies and scripts (`start`, `dev`, `seed`).

## 4. Key Features
1. **User Authentication:** Login and registration functionality for users.
2. **Service Browsing:** Users can view available services (Engine Repair, Tire Replacement, Battery Jumpstart, Emergency Towing) along with prices and durations.
3. **Booking System:** A detailed booking form where users provide personal info, vehicle details, service required, urgency, and location.
4. **Mechanic Dashboard:** A specialized view for mechanics to manage service requests, view active jobs, and track their statistics.
5. **Real-time Updates:** Integration with Socket.io allows for instant notification of new service requests or status changes.

## 5. How to Run Locally

**Backend:**
1. Navigate to the `Backend` directory: `cd Backend`
2. Create an environment file: `cp .env.example .env` (adjust variables if necessary)
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`
5. (Optional) Seed the database: `npm run seed`

**Frontend:**
Simply open `Frontend/index.html` in a web browser, or use a tool like VS Code Live Server. Ensure the backend is running so that any API calls made by `script.js` succeed.
