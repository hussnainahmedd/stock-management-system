<div align="center">

# 📦 Stock Management System

### _A Modern, Secure, and Efficient Inventory Tracker_

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](#-license)

<br/>

```
    ╔══════════════════════════════════════════════════════╗
    ║                                                      ║
    ║        ███████╗████████╗ ██████╗  ██████╗██╗  ██╗    ║
    ║        ██╔════╝╚══██╔══╝██╔═══██╗██╔════╝██║ ██╔╝    ║
    ║        ███████╗   ██║   ██║   ██║██║     █████╔╝     ║
    ║        ╚════██║   ██║   ██║   ██║██║     ██╔═██╗     ║
    ║        ███████║   ██║   ╚██████╔╝╚██████╗██║  ██╗    ║
    ║        ╚══════╝   ╚═╝    ╚═════╝  ╚═════╝╚═╝  ╚═╝    ║
    ║                                                      ║
    ║           Track your inventory seamlessly.           ║
    ╚══════════════════════════════════════════════════════╝
```

<br/>

> 🏢 A **full-stack web application** designed to simplify inventory tracking. Built with **Node.js, Express, and MongoDB**, it features a secure JWT-based authentication system, real-time stock updates, and a responsive glassmorphism UI for an exceptional user experience.

---

[Features](#-features) •
[Architecture](#-system-architecture) •
[Tech Stack](#-tech-stack) •
[API Endpoints](#-api-reference) •
[Setup](#-quick-start) •
[Project Structure](#-project-structure)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔐 Secure Authentication
- **JWT-based login** system
- Protected API routes
- Immediate client-side auth checks
- Secure HTTP headers with **Helmet**

### 📦 Inventory Management
- **Add new products** with details (name, quantity, price)
- **Update stock levels** in real-time
- **Delete items** from inventory
- Automatic timestamping of changes

</td>
<td width="50%">

### 📊 Dashboard & History
- View all current stock in a clean grid
- **Product History tracking**: monitor stock changes over time
- Real-time UI updates upon modifications
- Responsive design for desktop and mobile

### 🎨 Premium UI/UX
- **Glassmorphism** aesthetic with deep dark themes
- Smooth CSS animations and transitions
- Modern gradient accents and typography
- Clean, intuitive dashboard layout

</td>
</tr>
</table>

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Frontend [🎨 Client (Vanilla JS + HTML/CSS)]
        A[Login Page] -->|Auth| B(Dashboard)
        B --> C{API Calls}
        D[History Page] --> C
    end

    subgraph Backend [⚙️ Server (Node.js + Express)]
        C -->|HTTP REST| E[Express Router]
        E -->|JWT Verification| F[Auth Middleware]
        F --> G[Controllers]
    end

    subgraph Database [🗄️ MongoDB]
        G -->|Mongoose ODM| H[(MongoDB Atlas / Local)]
        H -.->|JSON Data| G
    end
```

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:---|:---|:---|
| 🎨 **Frontend** | HTML5, CSS3, Vanilla JS | Responsive, modern user interface |
| ⚙️ **Backend** | Node.js, Express.js | RESTful API server |
| 🗄️ **Database** | MongoDB (Mongoose) | NoSQL document storage |
| 🔐 **Security** | JWT, Helmet, CORS | Authentication and API protection |
| 🔧 **Config** | dotenv | Environment variable management |

</div>

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Why |
|:---|:---|
| **Node.js 18+** | JavaScript runtime for the backend |
| **MongoDB** | Database (Local instance or MongoDB Atlas cluster) |

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/hussnainahmedd/stock-management-system.git
cd stock-management-system
```

**2. Install dependencies**
```bash
cd backend
npm install
```

**3. Configure Environment Variables**

Create a `.env` file in the `backend` directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stock_management
SECRET_KEY=your_super_secret_jwt_key
```

**4. Start the server**
```bash
node app.js
```

**5. Open your browser** → **http://localhost:3000** 🎉

> [!NOTE]
> The default login credentials (for testing) are defined in `app.js`:
> - **Username:** `DB`
> - **Password:** `0702`

---

## 📡 API Reference

All protected routes require a valid JWT token in the `Authorization` header: `Bearer <token>`.

| Method | Endpoint | Protection | Description |
|:---:|:---|:---:|:---|
| `POST` | `/api/login` | 🔓 Public | Authenticate user and return JWT |
| `GET` | `/api/items` | 🔒 Private | Retrieve all inventory items |
| `POST` | `/api/items` | 🔒 Private | Add a new item to inventory |
| `PUT` | `/api/items/:id` | 🔒 Private | Update an existing item |
| `DELETE` | `/api/items/:id` | 🔒 Private | Delete an item from inventory |

---

## 📂 Project Structure

```
stock-management-system/
│
├── package.json               # Root package config
├── package-lock.json          
│
├── backend/                   # ⚙️ Server-side code
│   ├── app.js                 # Express app setup & API routes
│   ├── package.json           # Backend dependencies
│   ├── config/                # Database configuration
│   │   └── db.js              # MongoDB connection logic
│   ├── controllers/           # Route handler logic (if separated)
│   ├── middleware/            # Custom middleware
│   │   └── auth.js            # JWT verification middleware
│   └── models/                # Mongoose schemas
│       ├── Item.js            # Inventory item schema
│       └── history.js         # Stock change history schema
│
└── frontend/                  # 🎨 Client-side code (served by Express)
    ├── index.html             # Main dashboard (requires auth)
    ├── login.html             # Login page
    └── product-history.html   # Historical tracking view
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m '✨ Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ Star this repo if you found it useful!**

<br/>

Built with 💻 Node.js · 🍃 MongoDB · 🔒 JWT

</div>
