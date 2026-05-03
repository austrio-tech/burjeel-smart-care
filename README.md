```markdown
# Burjeel Smart Care – Frontend (React)

A responsive web application for the **Burjeel Smart Care** intelligent patient management and doctor appointment management system. Built with **React** and deployed on **Vercel**.

---

## 📋 Project Overview

This frontend provides:
- **Admin Dashboard** – manage patients, schedule reminders, track attendance, view reports.
- **Patient Portal** – receive SMS reminders, view appointments, use the **live chat**.
- **Pharmacist & IT Staff** interfaces – role‑based access for medication checks and system maintenance.

---

## 🧠 Development Methodology

We use the **DSDM (Agile)** methodology:
- **Iterative delivery** of features in short cycles.
- **Continuous feedback** from hospital stakeholders.
- **Prioritised requirements** using MoSCoW.
- **Timeboxed development** for each module (Dashboards, Reminders, Chat, Reports).

---

## 🛠 Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Library        | React 18 (with Vite)                |
| Routing        | React Router DOM v6                 |
| State Management| Context API + useReducer (for auth & global alerts) |
| Styling        | Tailwind CSS                        |
| HTTP Client    | Axios                               |
| Icons          | React Icons / Heroicons             |
| Charting       | Recharts (for admin analytics)      |
| Real‑time Chat | WebSocket (native) or Socket.IO client |
| Hosting        | Vercel                              |

---

## 📁 Project Structure

```
src/
├── assets/                 # Images, fonts, static files
├── components/             # Reusable UI components
│   ├── Layout/            # Navbar, Sidebar, Footer
│   ├── Forms/             # Login, Register, Schedule reminder forms
│   ├── Dashboard/         # Stats cards, attendance table, report charts
│   ├── Chat/              # ChatWindow, MessageBubble, ChatSidebar
│   └── common/            # Buttons, Modals, Alerts, Loaders
├── contexts/              # AuthContext, ChatContext, AlertContext
├── hooks/                 # Custom hooks (useAuth, useFetch, useSocket)
├── pages/                 # Route pages
│   ├── LoginPage.jsx
│   ├── AdminDashboard.jsx
│   ├── PatientDashboard.jsx
│   ├── AttendancePage.jsx
│   ├── ReminderPage.jsx
│   ├── ChatPage.jsx
│   └── ReportsPage.jsx
├── services/              # Axios API calls (api.js, authService, reminderService)
├── utils/                 # Helper functions (formatters, validators)
├── App.jsx
├── main.jsx               # Entry point, BrowserRouter
└── index.css              # Tailwind imports & global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
git clone <frontend-repo-url> burjeel-smartcare-frontend
cd burjeel-smartcare-frontend
npm install
```

### Environment Variables
Create a `.env` file in the root:
```env
VITE_API_BASE_URL=http://localhost:8000/api   # Backend URL (Render during production)
VITE_WS_URL=ws://localhost:8000               # WebSocket URL for chat
VITE_APP_NAME=Burjeel Smart Care
```

### Run Development Server
```bash
npm run dev
```
The app will run on `http://localhost:5173`.

---

## 🔧 How the Application Works

### 1. Authentication & Authorisation
- Users login via the `/login` page.
- JWT token is stored in `localStorage` (or memory) and sent via `Authorization` header.
- `AuthContext` provides user data and role.
- Protected routes (`/admin/*`, `/patient/*`) check role and token validity.

### 2. Key Pages & Components

| Page                | Main Components                                    | Description |
|---------------------|----------------------------------------------------|-------------|
| **Login**           | LoginForm                                          | Role‑based redirect after login. |
| **Admin Dashboard** | StatsCard, ReminderTable, AttendanceChart, ReportButton | Overview of all patients, reminders sent, attendance rates. |
| **Patient Management** | PatientTable, SearchBar, AddPatientModal       | CRUD operations for patient records. |
| **Reminders**       | ReminderList, ScheduleReminderForm                | View, create, and edit reminder schedules. |
| **Attendance**      | AttendanceLog, MarkAttendanceButton               | Track “Came” / “Not came” with timestamp. |
| **Live Chat**       | ChatWindow, MessageInput                          | Real‑time messaging between patients and staff (WebSocket). |
| **Reports**         | DateRangePicker, Charts (bar, pie)                 | Attendance and reminder statistics. |

### 3. State Management
- **AuthContext** – user details, token, login/logout functions.
- **AlertContext** – global success/error/info messages.
- **ChatContext** – holds current chat history and WebSocket connection.

### 4. API Integration
All backend calls are grouped in `src/services/`:
- `api.js` – Axios instance with interceptors (adds token, handles 401).
- `authService.js` – login, register, logout.
- `patientService.js` – patient CRUD.
- `reminderService.js` – schedule, send manual reminders.
- `attendanceService.js` – mark attendance, fetch logs.
- `chatService.js` – WebSocket connection and message history.

---

## 📦 Build & Deployment to Vercel

1. Build the project:
```bash
npm run build
```
2. Install Vercel CLI and deploy:
```bash
npm i -g vercel
vercel --prod
```
3. Set environment variables in Vercel dashboard (same as `.env` values).

The `build` output will be auto‑detected by Vercel. Your React app will be live at `https://burjeel-smartcare.vercel.app`.

---

## 🔗 Backend Integration

- The React app expects a REST API at `VITE_API_BASE_URL`.
- All endpoints return JSON.
- WebSocket endpoint (`VITE_WS_URL`) is used only for the live chat.
- CORS must be enabled on the backend for the Vercel domain.

---

## 🧪 Testing & Quality

- **Component tests** with React Testing Library (optional).
- **Linting** with ESLint and Prettier.
- Husky pre‑commit hooks for consistent formatting.

---

## ✅ Contribution & Workflow

1. Create a feature branch from `dev` (e.g., `feature/chat-box`).
2. Implement changes following the DSDM iteration plan.
3. Submit a pull request with a description.
4. Once approved, merge into `dev` and deploy to Vercel preview.

---

## 📄 License

This project is proprietary to Middle East College and Burjeel Hospital for academic use.

---

**Developed by:** Seham Albulushi (20S20055)  
**Supervisor:** Puttaswamy M. R.
```

Generic Instructions
Read the instructions in README.md and build the complete project according to those specifications, explicitly skipping any optional testing sections. Implement the project using modern web technologies and frameworks, ensuring all user interfaces feature smooth animations and transitions. Make the entire application fully responsive across desktop, tablet, and mobile devices with a mobile-first approach, fluid layouts, and touch-friendly interactions. Deliver production-ready code with optimized assets, clean architecture, and comprehensive documentation.