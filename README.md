# 🚀 AI Resume & Interview Analyzer (MERN Stack)

A full-stack web application engineered to help job seekers optimize their resumes using AI intelligence and prepare for interviews through automated, context-aware analysis and feedback.

---

## ✨ Key Features

* **AI Resume Analysis:** Automatically scans and evaluates resumes against specific job descriptions, highlighting matching skills, missing keywords, and structural improvements.
* **Smart Interview Preparation:** Dynamically generates role-specific technical and behavioral interview questions based on uploaded resume content.
* **Google OAuth Authentication:** Secure and seamless user sign-in integration using Google Accounts.
* **Secure RESTful Backend API:** Built with Node.js and Express, featuring environment security, custom error handling, and robust data validation.
* **Data Persistence:** Fully integrated with MongoDB and Mongoose for tracking user history and resume analysis reports.
* **Modern Frontend:** Fast, responsive user interface built using React, Vite, and modern CSS frameworks.

---

## 🛠️ Tech Stack

* **Frontend:** React, Vite, JavaScript (ES6+), HTML5, CSS3 / Tailwind CSS
* **Backend:** Node.js, Express.js, REST APIs
* **Database:** MongoDB, Mongoose (Cloud-hosted via MongoDB Atlas)
* **Authentication:** Google OAuth 2.0 / JWT
* **Deployment Platforms:** Vercel (Frontend) & Render (Backend)

---

## 📂 Project Directory Structure

```text
INTERVIEW-AI/
├── Backend/          # Node.js Express server, routes, controllers, models
│   ├── src/          # Source files and configuration
│   ├── .env.example  # Template for environment variables
│   └── server.js     # Entry point for the backend server
└── Frontend/         # React application client
    ├── src/          # Components, pages, and services
    ├── .env.example  # Template for frontend environment variables
    └── package.json  # Frontend dependencies

---

## ⚙️ Step-by-Step Local Setup Guide

If you want to run, test, or modify this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have the following installed on your computer:
* **Node.js** (v16 or higher recommended)
* **Git**
* A free **MongoDB Atlas** account (or a local MongoDB instance)

---

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:
git clone https://github.com/Priybyte/AI-RESULYZER.git
cd INTERVIEW-AI

---

### Step 2: Set Up and Run the Backend

1. Navigate into the backend folder:
   cd Backend

2. Install the required dependencies:
   npm install

3. Create an environment configuration file:
   - Look at the `.env.example` file provided in the `Backend` folder.
   - Create a new file named `.env` in the same directory.
   - Add your required environment variables (PORT, MONGO_URI, Google Client credentials, JWT secrets).

4. Start the backend development server:
   npm run dev

---

### Step 3: Set Up and Run the Frontend

1. Open a new terminal window/tab, and navigate into the frontend folder from the root directory:
   cd Frontend

2. Install the required frontend dependencies:
   npm install

3. Configure your frontend environment variables:
   - Check if there is a `.env.example` file in the `Frontend` folder.
   - Create a `.env` file and set your backend API base URL (`VITE_API_URL=http://localhost:5000`).

4. Start the frontend development server:
   npm run dev

---

## 🌐 Live Deployment Links
* **Frontend Application:** [Live URL coming soon / Add Vercel Link]
* **Backend API Service:** [Live URL coming soon / Add Render Link]

---

## 📄 License
This project is open-source and available under the MIT License.