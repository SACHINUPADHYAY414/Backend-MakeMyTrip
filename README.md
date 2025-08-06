# ✈️ YatraVille - City to City Bus Booking System

A **full-stack web application** built with **React**, **Redux**, **Node.js**, **Express**, and **PostgreSQL** that allows users to register, log in, and book seats for city-to-city bus journeys.

## 🚀 Features

* 🔐 **User Authentication** – Login and register with secure credentials (JWT & bcrypt)
* 🚌 **City-to-City Bus Search** – Easily browse available buses between cities
* 🎟️ **Seat Booking System** – Select and book available seats in real-time
* 🔍 **Filter Functionality** – Filter buses by city, time, availability, and more
* 📦 **State Management** – Managed using Redux and Redux Toolkit
* 💬 **Chatbot Support** – In-app chatbot to assist users with bookings, routes, and FAQs
* 👤 **Profile Settings** – Users can update their profile information and manage account settings
* 🔑 **Forgot Password** – Secure password reset functionality via email verification
* 🚌 **Admin Controls** – Add and manage buses, seats, cities, states, and countries from backend APIs
* 🌐 **RESTful API** – Node.js & Express backend with organized routes and controllers
* 🗄️ **PostgreSQL Database** – Stores users, buses, bookings, seats, and geographical data
* 🛡️ **CORS-Enabled Backend** – Cross-origin requests supported for frontend-backend integration
* ⚡ **Fast Refresh & HMR** – Powered by Vite for instant feedback during development

---

## 💬 Chatbot Support

Our built-in chatbot enhances the user experience by providing:

* 🧭 **Guided Search** – Helps users search for cities and available buses
* ❓ **FAQs** – Answers common queries about seat booking, cancellations, and more
* 📅 **Smart Suggestions** – Offers alternative travel dates and routes
* 🔄 **Live Interaction** – Responds to user queries in real-time via the frontend UI

The chatbot can be configured either via rule-based logic or integrated with NLP models like GPT-based APIs for enhanced interaction.

---

## 🛠️ Tech Stack

| Frontend      | Backend    | Database           | Tools & Libraries     |
| ------------- | ---------- | ------------------ | --------------------- |
| React + Vite  | Node.js    | PostgreSQL         | Redux, Axios, Express |
| Redux Toolkit | Express.js | pg (node-postgres) | CORS, dotenv, bcrypt  |

---

## 📁 Project Structure

```
YatraVille/
├── client/               # React frontend source code
├── server/               # Node.js + Express backend source code
│   ├── controllers/      # Route controllers for API endpoints
│   ├── models/           # Database models and schemas
│   ├── routes/           # Express routes
│   ├── middleware/       # Authentication & other middleware
│   ├── utils/            # Utility functions (e.g., JWT, bcrypt)
│   ├── config/           # DB and environment config
│   └── app.js            # Main Express app entry point
└── README.md             # This documentation file
```

---

## 🧪 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/YatraVille.git
cd YatraVille
```

### 2️⃣ Setup Environment Variables

Create a `.env` file in the `server` folder with the following:

```
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/YatraVille
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_API_KEY=your_email_service_api_key # For forgot password emails
```

### 3️⃣ Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4️⃣ Run the project

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
```

---

## 🔐 Authentication & User Management

* Passwords are hashed securely with **bcrypt**.
* JWT-based authentication for session management.
* Users can reset forgotten passwords securely via email verification.

---

## 🚌 Admin Backend Functionalities (Node.js + Express + PostgreSQL)

The backend exposes RESTful APIs to manage:

* **Bus Management**
  Create, update, delete buses with details like bus number, type, capacity, etc.

* **Seat Management**
  Add or modify seat availability linked to each bus.

* **City, State, Country Management**
  Maintain master data for cities, states, and countries to populate bus routes and bookings.

* **User Profile Settings**
  Update user profile data such as name, contact info, and preferences.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📄 License

This project is licensed under the MIT License.

---

If you want, I can help you generate detailed API documentation for the backend routes next — just ask! Would you like that?
