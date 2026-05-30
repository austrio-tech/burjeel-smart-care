# Burjeel Smart Care — Frontend

A React web application for managing patients, reminders, attendance, and communication at Burjeel Hospital. Different users (admin, doctor, patient, IT staff) each see a tailored dashboard with only the tools relevant to their role.

---

## Tech Stack

| What | Tool |
|---|---|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| HTTP Requests | Axios |
| Real-time Chat | Socket.IO client |
| Charts | Recharts |
| Icons | React Icons |
| Export (CSV/Excel/PDF) | SheetJS, jsPDF, file-saver |

---

## Project Structure

```
src/
├── main.jsx              # App entry point — mounts React, wraps everything in providers
├── App.jsx               # Root component — handles routing and role-based page access
├── App.css               # Global styles
│
├── contexts/             # Shared state accessible anywhere in the app
│   ├── AuthContext.jsx   # Who is logged in, login/logout logic
│   ├── AlertContext.jsx  # Toast notification system (success, error, warning)
│   └── ChatContext.jsx   # Real-time chat state and Socket.IO connection
│
├── hooks/                # Reusable logic extracted into functions
│   ├── useAuth.js        # Easy access to the auth context
│   ├── useSocket.js      # Easy access to the chat context
│   ├── useReportExport.js# CSV / Excel / PDF export logic
│   └── useFetch.js       # Generic fetch wrapper (legacy, mostly unused)
│
├── services/             # All API calls to the backend — one file per topic
│   ├── api.js            # Axios instance with auth token injection
│   ├── authService.js    # Login, register, get current user
│   ├── patientService.js # Create, read, update, delete patients
│   ├── attendanceService.js # Mark and fetch attendance records
│   ├── reminderService.js   # Schedule and send reminders
│   ├── reportsService.js    # Attendance and reminder analytics
│   ├── userService.js    # Admin user management
│   └── chatService.js    # Conversations and messages
│
├── components/
│   ├── Layout/           # The shell around every page
│   │   ├── Layout.jsx    # Sidebar + navbar + content area wrapper
│   │   ├── Sidebar.jsx   # Left navigation — links change per role
│   │   ├── Navbar.jsx    # Top bar with hamburger menu
│   │   └── Footer.jsx    # Bottom bar
│   └── common/           # Reusable UI building blocks
│       ├── Alert.jsx         # Single toast notification
│       ├── AlertContainer.jsx# Renders all active toasts
│       ├── Badge.jsx         # Coloured status label
│       ├── Button.jsx        # Styled button with variants
│       ├── Card.jsx          # White box container
│       ├── ExportMenu.jsx    # Dropdown to export CSV/Excel/PDF
│       ├── Input.jsx         # Text input with icon support
│       ├── Loader.jsx        # Full-page loading spinner
│       ├── Modal.jsx         # Pop-up dialog
│       ├── Select.jsx        # Dropdown selector
│       └── Table.jsx         # Data table with striping and hover
│
├── pages/                # One file per screen
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── AdminDashboard.jsx
│   ├── DoctorDashboard.jsx
│   ├── PatientDashboard.jsx
│   ├── PatientsPage.jsx        # Admin/doctor patient management
│   ├── DoctorManagementPage.jsx
│   ├── ReminderPage.jsx
│   ├── AttendancePage.jsx
│   ├── ReportsPage.jsx
│   ├── ChatPage.jsx
│   ├── PatientDoctorsPage.jsx
│   ├── PatientAppointments.jsx
│   ├── SettingsPage.jsx
│   └── ITDashboard (via AdminDashboard)
│
└── utils/                # Pure helper functions
    ├── constants.js      # App-wide fixed values
    ├── formatters.js     # Date, number, text formatting
    └── validators.js     # Form field validation rules
```

---

## How It Works

### Authentication
When a user logs in, the backend returns a JWT token. The frontend stores that token in `localStorage` and attaches it to every API request via an Axios interceptor. On page load, `AuthContext` reads the token from `localStorage` to restore the session automatically.

### Role-Based Routing
`App.jsx` checks `user.role` and only renders routes that belong to that role. An admin cannot accidentally visit a patient page and vice versa. The sidebar in `Sidebar.jsx` mirrors this — each role has its own list of navigation links.

### Real-time Chat
`ChatContext` opens a Socket.IO connection to the backend when the user is logged in. Messages sent by others arrive instantly via the `message` event. Typing indicators use the `user_typing` event.

### Notifications
`AlertContext` holds a list of active toast messages. Any component can call `success("Done!")` or `error("Something went wrong")` and a toast appears on screen and auto-dismisses after a few seconds.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

The app expects the backend running at `http://localhost:8000`. Copy `.env.example` to `.env` and adjust if needed.

---

## Deployment (Vercel)

The `vercel.json` at the project root rewrites all URLs to `index.html`, which is required for React Router to work correctly when a user refreshes the page or lands directly on a route.

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:8000/api/v1`) |
| `VITE_WS_URL` | WebSocket server URL (e.g. `ws://localhost:8000`) |
| `VITE_APP_NAME` | Application display name |
| `VITE_APP_VERSION` | Version shown in the sidebar footer |
