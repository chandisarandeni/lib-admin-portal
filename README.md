
# 📚 Library Management System – Microservices Architecture

This is a microservice-based Library Management System built using Spring Boot, React (Vite), and MySQL. It supports different user roles such as Admin, Librarian, Library Member, and Guest. Each function of the system is modularized into individual microservices and accessed through an API Gateway.

---

## 🔧 Tech Stack

- Backend: Spring Boot (Java)
- Frontend: React (Vite)
- Database: MySQL
- API Gateway: Spring Cloud Gateway
- Inter-service Communication: REST
- Notification: External Email Service (SMTP or third-party)

---

## 🧭 System Overview
<img width="1246" height="738" alt="Screenshot 2025-07-24 204135" src="https://github.com/user-attachments/assets/ebfa4335-4513-400d-b156-477146951040" />

---

## 📌 Microservices

| Service Name           | Port | Description                                   |
| ---------------------- | ---- | --------------------------------------------- |
| `api-gateway`          | 8080 | Routes traffic to all microservices           |
| `auth_service`         | 8081 | Handles authentication and token generation   |
| `user_service`         | 8082 | Manages user roles, profiles, and permissions |
| `book_service`         | 8083 | Manages books, inventory, and search          |
| `borrowing_service`    | 8084 | Handles borrow/return logic and transactions  |
| `ratings_service`      | 8088 | Manages ratings/reviews for books             |
| `notification_service` | 3000 | Sends emails or notifications to users        |

---

## 🧑‍💻 Frontend Clients

| Client Role       | Port |
| ----------------- | ---- |
| Guest Frontend    | 5173 |
| Library Member UI | 5174 |
| Librarian UI      | 5175 |
| Admin UI          | 5176 |

---

## 🛢️ Databases

| Database Name              | Used By            |
| -------------------------- | ------------------ |
| `lib_user_management_db`   | user\_service      |
| `lib_book_service_db`      | book\_service      |
| `lib_borrowing_service_db` | borrowing\_service |
| `lib_ratings_db`           | ratings\_service   |

---

## 🚀 How to Run

1. Clone all services and run them individually via Maven/Gradle or Docker Compose.
2. Start frontend apps (on respective ports).
3. Ensure MySQL is running and databases are created.
4. Configure `.env` or `application.properties` files for DB and Email credentials.
