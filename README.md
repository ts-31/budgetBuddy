# Budget Buddy

A full-stack application to help users manage their finances with ease.

## Features

- **User Authentication**: Secure login and registration system.
- **Expense Tracking**: Add, edit, and delete expenses.
- **Budget Management**: Set and monitor budgets for different categories.
- **Analytics**: Visual representations of spending patterns using charts.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download/) (v16 or later, includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally) or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- [Git](https://git-scm.com/) for version control

## Setup Instructions

Follow these steps to set up the project locally:

### Clone the Repository

```bash
git clone https://github.com/yourusername/budget-buddy.git
cd budget-buddy
```

### Make the .env file in backend directory

Create a `.env` file based of `env.example` in the backend directory and save it as .env.

```bash
cd backend
```

#### Example .env file

```bash
# .env.example
PORT=3000
MONGO_URI=your_mongo_uri
JWT_SECRET_KEY=your_secret_key_here
NODE_ENV=development
ENCRYPTION_SALT=10
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password_here
```

### Setup

To install dependencies and start the development servers for both frontend and backend, run the following commands:

1. Install dependencies for frontend

```bash
npm install
npm run dev
```
2. Install dependencies for backend

```bash
npm install
npm run dev
```



