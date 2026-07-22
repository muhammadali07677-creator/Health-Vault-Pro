# 🏥 HealthVault Pro (V2) — AI-Powered Clinical Record & Health Management System

[![React](https://img.shields.io/badge/Frontend-React_19-blue?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express_v4-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/AI-Google_Gemini_2.5_Flash-8E75B2?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**HealthVault Pro** is a state-of-the-art digital healthcare repository and AI-driven clinical assistant. Designed for modern patient record management, it empowers individuals to track disease trajectories, manage lab reports and prescriptions, perform drug interaction checks, analyze medical reports via Google Gemini AI, and review healthcare providers.

---

## ✨ Key Features

### 🧠 1. Clinical Mind-Map & Disease Timelines
* **Disease-Centric Node Grouping**: Link medical history records to specific disease nodes for structured, chronological health tracking.
* **Prescription & Visit Logs**: Record doctor visits, hospital names, treatment plans, prescribed test lists, and detailed dosage instructions.

### 📄 2. Lab Report & Prescription Attachment Repository
* **PDF Upload & Storage**: Attach lab test reports and prescription PDFs directly to patient accounts.
* **Instant In-Browser Viewer**: Preview uploaded PDF files instantly without downloading.
* **One-Click Clinical Summary Export**: Generate clean, downloadable PDF medical summaries powered by `jsPDF`.

### 🤖 3. Google Gemini AI Health Intelligence
* **🔬 Lab Report AI Analyzer**: Automatically extracts lab values, flags abnormal/critical indicators, provides healthy reference ranges, recommends specialist doctors, and generates dietary advice.
* **📊 Multi-Visit & Report Evolution Comparison**: Compare past vs. recent lab reports or multi-doctor visits to analyze treatment progression and effectiveness.
* **💊 Drug Interaction & Severity Checker**: Evaluates prescribed medicine lists for potential drug-drug interactions with severity classification (*mild, moderate, severe, contraindicated*).
* **📷 Prescription Image Parser (OCR)**: Scans handwritten or printed prescription images to auto-populate medicine names, dosages, and schedules.
* **🩺 Automated Diagnostic Suggestions**: Evaluates abnormal report values to suggest potential underlying conditions and urgency levels.

### ⭐ 4. Healthcare Provider Directory & Reviews
* Searchable directory of doctors, specializations, and hospitals.
* Public patient rating system with star ratings and feedback.

---

## 🛠️ Technology Stack

### **Frontend**
- **Core**: React 19, Vite, React Router v7
- **Styling & Motion**: Tailwind CSS v4, Framer Motion, Lucide React Icons
- **PDF Generation & HTTP**: `jsPDF`, `axios`

### **Backend**
- **Runtime & Framework**: Node.js, Express.js
- **Database & Auth**: MongoDB (Mongoose ODM), `bcrypt` password hashing (CNIC-based identification)
- **File Management**: `multer` (PDF & Image uploads with static routing)
- **AI Integration**: `@google/genai` (Google Gemini 2.5 Flash SDK)

---

## 📁 Repository Structure

```text
HealthVault/
├── backend/
│   ├── models/
│   │   ├── Patient.js              # MongoDB Patient schema & subdocuments
│   │   └── Review.js               # MongoDB Doctor review schema
│   ├── uploads/                    # Secure PDF & image storage folder
│   ├── migrate-to-mongodb.js       # Standalone migration script
│   ├── server.js                   # Main Express server & Gemini AI routes
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI components (Navbar, Footer)
│   │   ├── context/                # AuthContext for session management
│   │   ├── pages/                  # Patient Profile, Doctor Ratings, Auth, etc.
│   │   ├── index.css               # Design system & Tailwind styling
│   │   └── App.jsx                 # Routes & layout definition
│   └── package.json
├── start_v2.bat                    # One-click startup script for Windows
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance (`mongodb://localhost:27017`) or MongoDB Atlas URI
- **Google Gemini API Key**: Get your free API key from [Google AI Studio](https://aistudio.google.com/)

---

### **1. Environment Configuration**

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/healthvault
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

### **2. Backend Setup**

```bash
cd backend
npm install
npm run dev
```
*Backend server will start on `http://localhost:5000`.*

---

### **3. Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```
*Frontend will be accessible at `http://localhost:5173`.*

---

### ⚡ Quick Start (Windows)
Alternatively, double-click **`start_v2.bat`** in the root folder to launch both backend and frontend servers simultaneously!

---

## 🛡️ Security & Privacy Features
* **Encrypted Passwords**: Secure salted password hashing using `bcrypt`.
* **Primary Key CNIC Validation**: Unique identity management per patient.
* **Sanitized API Responses**: Sensitive credentials are never exposed in user payload responses.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an Issue or submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](file:///d:/the-icat-2-fnal/version%202.0/HealthVault/LICENSE) for more information.

---

## 🚨 Medical Disclaimer

**HealthVault Pro is for educational, personal health tracking, and demonstration purposes only.** It is not a licensed medical device and does not provide clinical diagnostic or treatment decisions.

- **AI Recommendations**: Features utilizing Google Gemini AI (lab report extraction, drug interaction checks, diagnostic suggestions) are for informational assistance only and may produce inaccurate or incomplete outputs.
- **Consult Professionals**: Always consult a qualified healthcare provider for medical advice, diagnoses, or treatment plans.

