# 🥛 MilkMitra – Simple Dairy Management for Rural Sellers

**MilkMitra** is a backend-powered dairy management system designed for local milk sellers.
---

## ⚙️ Features

- ✅ Seller authentication with JWT + refresh tokens
- 🐄 Add & manage milk entries (fat %, SNF, quantity, total)
- 💸 Add & manage purchase records
- 🧾 Auto-generate monthly earnings report
- 🗓️ Daily summary of milk collection
- 🔒 Forgot/reset password via email
- 📍 Clean routing structure and controller logic

---

## 🔗 Live API

> Base URL: `https://milkmitra-backend.onrender.com/api/v1`

---

## 🛠️ Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Backend      | Node.js + Express             |
| Database     | MongoDB + Mongoose            |
| Auth         | JWT + bcrypt                  |
| Email        | Nodemailer                    |
| Deployment   | Render (free tier)            |
| Testing      | Postman + environment setup   |

---

## 🧪 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | `/register`            | Register seller                 |
| POST   | `/login`               | Login and get tokens            |
| POST   | `/refresh-token`       | Get new access token            |
| POST   | `/logout`              | Logout seller                   |
| POST   | `/change-password`     | Change current password         |
| GET    | `/current-seller`      | Get logged-in seller details    |
| POST   | `/forget-password`     | Send reset email                |
| POST   | `/reset-password`      | Reset password                  |

---

### 🐮 Milk Entry Routes

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| POST   | `/add-milk-entry`    | Add new milk record            |
| GET    | `/get-milk-entries`  | Filter and view entries        |
| POST   | `/update-milk-entry` | Update existing entry          |
| DELETE | `/delete-milk-entry` | Delete an entry                |

---

### 💰 Purchase Routes

| Method | Endpoint        | Description                   |
|--------|------------------|-------------------------------|
| POST   | `/add`           | Add purchase record           |
| GET    | `/`              | View all purchase records     |
| PATCH  | `/update/:id`    | Update purchase by ID         |
| DELETE | `/delete/:id`    | Delete purchase by ID         |

---

### 📊 Monthly Summary

| Method | Endpoint       | Description                            |
|--------|----------------|----------------------------------------|
| GET    | `/generate`    | Generate summary of selected month     |
| GET    | `/`            | Fetch all or specific month summary    |

---

### 📅 Today Summary

| Method | Endpoint              | Description               |
|--------|-----------------------|---------------------------|
| GET    | `/get-today-summary`  | Get today’s milk stats    |

---

## 🌐 Postman Setup

1. 🔧 Create **MilkMitra Environment**
   - `server = https://milkmitra-backend.onrender.com/api/v1`
   - `accessToken` (auto set after login)

2. 📁 Create **MilkMitra Collection**
   - Organize by folders: Auth, MilkEntry, Purchase, Summary, etc.

3. 🧪 Test endpoints with accessToken via headers or cookies.

---

## 🤝 Contributing

If you know rural problems and want to solve them with clean code—join the mission. PRs and suggestions welcome!

---

## 💡 Made by

**Suraj Bhatt** – CS student
Solving real problems 