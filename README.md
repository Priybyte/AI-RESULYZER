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

⚙️ Step-by-Step Local Setup Guide
If you want to run, test, or modify this project locally on your machine, follow these steps:

Prerequisites
Make sure you have the following installed on your computer:

Node.js (v16 or higher recommended)

Git

A free MongoDB Atlas account (or a local MongoDB instance)

Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:

Bash
git clone [https://github.com/Priybyte/AI-RESULYZER.git](https://github.com/Priybyte/AI-RESULYZER.git)
cd INTERVIEW-AI
Step 2: Set Up and Run the Backend
Navigate into the backend folder:

Bash
cd Backend
Install the required dependencies:

Bash
npm install
Create an environment configuration file:

Look at the .env.example file provided in the Backend folder.

Create a new file named .env in the same directory.

Add your required environment variables (such as your PORT, MONGO_URI, Google Client credentials, and JWT secrets):

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
Start the backend development server:

Bash
npm run dev
(Your backend should now be running locally on http://localhost:5000 or the port you specified).

Step 3: Set Up and Run the Frontend
Open a new terminal window/tab, and navigate into the frontend folder from the root directory:

Bash
cd Frontend
Install the required frontend dependencies:

Bash
npm install
Configure your frontend environment variables:

Check if there is a .env.example file in the Frontend folder.

Create a .env file and set your backend API base URL so the frontend knows where to send requests:

Code snippet
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
Start the frontend development server:

Bash
npm run dev
(Vite will spin up a local server, usually at http://localhost:5173. Open this link in your browser to use the app).

🌐 Live Deployment Links
Frontend Application: [Live URL coming soon / Add Vercel Link]

Backend API Service: [Live URL coming soon / Add Render Link]

📄 License
This project is open-source and available under the MIT License.