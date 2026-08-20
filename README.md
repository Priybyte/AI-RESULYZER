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
