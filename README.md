# 💰 Budget Buddy

**Budget Buddy** is a full-stack personal finance management application that helps users track expenses, manage budgets, and gain insights into their spending habits.  
The project is built with scalability and real-world deployment in mind.

---

## 🌐 Live Deployments

This project is actively deployed using **two separate branches**, each optimized for a specific use case:

### 🔹 Main Branch (Frontend + Core Backend)
- **Deployment Platform:** Vercel  
- **Purpose:** Stable production build for core budgeting features  
- **Live URL:** https://budget-buddy-frontend-phi.vercel.app/

### 🔹 Feature/Chatbot Branch
- **Deployment Platform:** Render  
- **Purpose:** Supports real-time chatbot functionality using WebSockets  
- **Live URL:** https://budgetbuddy-wokh.onrender.com/

> Both branches share the same core codebase and README for consistency, but are deployed separately due to infrastructure requirements (WebSockets support).

## 🔀 Branch Navigation

- 🔵 **Main Branch (Stable / Production)**  
  👉 https://github.com/ts-31/budgetBuddy/tree/main

- 🟢 **Feature / Chatbot Branch (WebSocket + Chatbot)**  
  👉 https://github.com/ts-31/budgetBuddy/tree/feature/chatbot

---

## ✨ Key Features

- 🔐 **User Authentication**
  - Secure login and registration using JWT

- 📊 **Expense Tracking**
  - Add, edit, and delete daily expenses
  - Categorized expense management

- 🎯 **Budget Management**
  - Set monthly/category-wise budgets
  - Monitor budget utilization in real time

- 📈 **Analytics & Insights**
  - Visual charts for spending patterns
  - Category-wise breakdowns

- 🤖 **AI Chatbot (Feature Branch)**
  - Real-time chatbot using WebSockets
  - Helps users query expenses and budgets conversationally

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Chart Libraries

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- WebSockets (Chatbot feature)

### Deployment
- **Vercel** – Frontend & main backend
- **Render** – Chatbot-enabled backend (WebSocket support)

---

## 📋 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/en/download/) (v16 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) or MongoDB Atlas
- [Git](https://git-scm.com/)

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/budget-buddy.git
cd budget-buddy
```

---

### 2️⃣ Backend Environment Setup

Navigate to the backend directory and create a `.env` file using `env.example` as reference.

```bash
cd backend
```

#### Example `.env` file

```env
PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET_KEY=your_secret_key_here
NODE_ENV=development
ENCRYPTION_SALT=10
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password_here
```

---

### 3️⃣ Install Dependencies & Run Servers

#### Frontend

```bash
npm install
npm run dev
```

#### Backend

```bash
npm install
npm run dev
```

---

## 🧠 Architecture Notes

- Modular backend structure for scalability
- Separate deployment strategy to support WebSockets
- Environment-based configuration
- Production-ready authentication & error handling

---

## 🚀 Future Enhancements

- Advanced financial insights & forecasting
- Role-based access control
- Notification system (email / in-app)
- Mobile-friendly UI improvements
- Multi-currency support

---

## 👨‍💻 Author

**Tejas Sonawane**

- GitHub: https://github.com/ts-31

---

⭐ If you find this project useful, consider giving it a star!
