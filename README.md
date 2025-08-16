# PanScience Assignment

This project is a full-stack web application built as part of the PanScience Innovations assignment.  
It includes both a **frontend** (React + Vite + TailwindCSS) and a **backend** (Node.js + Express + MongoDB).

---

## 🚀 Tech Stack

### Frontend
- React (with Vite)
- TailwindCSS (for styling)
- Axios (for API calls)
- React Router (for navigation)

### Backend
- Node.js with Express.js
- MongoDB with Mongoose (Database)
- JWT (JSON Web Token) for authentication
- Bcrypt.js for password hashing
- Cookie Parser for session handling
- CORS enabled API

### Other Tools
- Docker (for containerization)
- Postman (for API testing & documentation)

---

## 📂 Project Structure

```
/panscience-assignment-main
│── /frontend         # React frontend
│── /backend          # Express backend
│   ├── /routes       # API routes (auth, task)
│   ├── /models       # Database models (User, Task)
│   ├── server.js     # Main backend entry point
│── docker-compose.yml
│── README.md
```

---

## ⚙️ Features

- User Authentication (Signup, Login, Logout)
- JWT-based session management with cookies
- Task Management (CRUD APIs)
- MongoDB Atlas cloud database integration
- Protected routes with middleware
- API Documentation available via Postman

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` → Register a new user  
- `POST /api/auth/login` → Login user  
- `POST /api/auth/logout` → Logout user  

### Task Management
- `GET /api/task/` → Fetch all tasks (protected)  
- `POST /api/task/` → Create a task (protected)  
- `PUT /api/task/:id` → Update a task (protected)  
- `DELETE /api/task/:id` → Delete a task (protected)  

---

## 🐳 Docker Setup

This project uses Docker for containerization.

### Run using Docker Compose:
```sh
docker compose up --build
```

This will start both **frontend** and **backend** services.

---

## 🛠️ Installation & Running Locally

### Clone the repository
```sh
git clone https://github.com/yourusername/panscience-assignment-main.git
cd panscience-assignment-main
```

### Backend Setup
```sh
cd backend
npm install
npm start
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

Backend runs on **http://localhost:5000**  
Frontend runs on **http://localhost:5173**  

---

## 📜 Environment Variables

Create a `.env` file in **backend/** with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

---

## 🧪 API Documentation

A **Postman collection** (`PanScience-API.postman_collection.json`) is included for API testing.  
Import it into Postman to test authentication and task APIs.

---

## ✨ Author

Developed by **Vashista Dara** as part of the **PanScience Innovations Assignment**.
