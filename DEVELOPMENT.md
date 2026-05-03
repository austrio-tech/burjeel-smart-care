# Burjeel Smart Care – Frontend (React + Vite)

A modern, fully responsive web application for the **Burjeel Smart Care** intelligent patient management and doctor appointment management system. Built with **React 18**, **Vite**, **Tailwind CSS**, and deployed on **Vercel**.

## 🎯 Overview

Burjeel Smart Care is a comprehensive healthcare management platform providing:

- **Admin Dashboard** – Comprehensive patient and appointment management, analytics, and reporting
- **Patient Portal** – Appointment viewing, SMS reminders, and direct communication with healthcare staff
- **Pharmacist & IT Staff Interfaces** – Role-based access for specialized functions
- **Live Chat System** – Real-time WebSocket-based messaging between patients and healthcare professionals
- **Analytics & Reports** – Detailed attendance tracking, reminder delivery statistics, and performance metrics
- **Mobile-First Design** – Fully responsive and optimized for all devices

## 🚀 Key Features

### ✨ Core Functionality
- **Role-Based Access Control** – Admin, Patient, Pharmacist, IT Staff roles with specific dashboards
- **Patient Management** – Add, update, delete, and bulk import patient records
- **Reminder System** – SMS/Email reminders with scheduling (once, daily, weekly, monthly)
- **Attendance Tracking** – Mark patient attendance with status tracking and reporting
- **Live Chat** – Real-time WebSocket communication with typing indicators
- **Analytics Dashboard** – Charts, graphs, and comprehensive reporting

### 📱 UI/UX Features
- **Responsive Design** – Mobile-first approach with fluid layouts
- **Smooth Animations** – Page transitions, button effects, and loading states
- **Dark Mode Ready** – Color system supports theme switching
- **Accessibility** – WCAG compliant with keyboard navigation and ARIA labels
- **Performance Optimized** – Code splitting, lazy loading, and efficient bundling

## 🛠 Tech Stack

| Layer              | Technology                 |
| ------------------ | -------------------------- |
| **Build Tool**     | Vite 5.2.0                 |
| **Library**        | React 18.3.1               |
| **Router**         | React Router DOM v6.24     |
| **State Mgmt**     | Context API + useReducer   |
| **Styling**        | Tailwind CSS 3.4.1         |
| **HTTP Client**    | Axios 1.7.0                |
| **Real-time**      | Socket.io Client 4.7.2     |
| **Charts**         | Recharts 2.12.0            |
| **Icons**          | React Icons 5.2.0          |
| **Date Utils**     | date-fns 3.3.1             |
| **Hosting**        | Vercel                     |

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Table.jsx
│   │   ├── Alert.jsx
│   │   ├── Badge.jsx
│   │   ├── Loader.jsx
│   │   └── AlertContainer.jsx
│   └── Forms/
├── contexts/
│   ├── AuthContext.jsx
│   ├── AlertContext.jsx
│   └── ChatContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── useSocket.js
├── pages/
│   ├── LoginPage.jsx
│   ├── AdminDashboard.jsx
│   ├── PatientDashboard.jsx
│   ├── AttendancePage.jsx
│   ├── ReminderPage.jsx
│   ├── ChatPage.jsx
│   └── ReportsPage.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── patientService.js
│   ├── reminderService.js
│   ├── attendanceService.js
│   └── chatService.js
├── utils/
│   ├── formatters.js
│   ├── validators.js
│   └── constants.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or yarn 3.0.0

### Installation

1. **Clone repository:**
```bash
git clone <repository-url>
cd burjeel-smartcare-frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env .env.local
```

4. **Configure `.env.local`:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000
VITE_APP_NAME=Burjeel Smart Care
VITE_APP_VERSION=1.0.0
```

5. **Start development server:**
```bash
npm run dev
```

App runs on `http://localhost:5173`

## 📖 Development Guide

### Authentication Flow
1. User logs in via LoginPage
2. Backend returns JWT token and user data
3. Token stored in localStorage, user in AuthContext
4. All API requests include token in Authorization header
5. 401 responses trigger automatic logout and redirect

### State Management
- **AuthContext** – User authentication, login/logout, user data
- **AlertContext** – Global notifications (success, error, warning, info)
- **ChatContext** – Real-time messaging and WebSocket connection

### Component Patterns

**Form Component:**
```jsx
const [formData, setFormData] = useState({});
const [errors, setErrors] = useState({});

const validateForm = () => {
  // Validation logic
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  // Submit logic
};
```

**Page Component:**
```jsx
export default function PageName() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Load data
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* Content */}
    </div>
  );
}
```

### Responsive Design

Mobile-first approach:
```jsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
className="hidden md:block"
className="px-4 md:px-8"
```

### Animations

Built-in Tailwind animations:
```jsx
className="animate-fade-in animate-slide-up animate-pulse-soft"
```

## 🔌 API Integration

### Service Layer Pattern

```javascript
import api from './api';

export const getPatients = async (page = 1, limit = 20) => {
  const response = await api.get('/patients', { params: { page, limit } });
  return response;
};
```

### Using Services

```jsx
import * as patientService from '../services/patientService';

const [patients, setPatients] = useState([]);

useEffect(() => {
  const fetchPatients = async () => {
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (error) {
      showError(error.message);
    }
  };
  fetchPatients();
}, []);
```

## 🔄 WebSocket Integration

```javascript
import * as chatService from '../services/chatService';

const socket = await chatService.connectWebSocket();

socket.on('message', (data) => {
  console.log('New message:', data);
});

socket.emit('send_message', { conversationId: '123', text: 'Hello' });
```

## 📊 Forms & Validation

```javascript
import { validateEmail, validatePassword, validateForm } from '../utils/validators';

const errors = validateForm(formData, {
  email: { required: true, email: true },
  password: { required: true, minLength: 8 },
});
```

## 🎨 Theming

Tailwind CSS color system:
```tailwind
text-primary-600, bg-primary-100, border-primary-500
text-secondary-900, bg-secondary-50
text-success, text-danger, text-warning, text-info
```

## 📦 Building for Production

```bash
npm run build
npm run preview
vercel --prod
```

## 🌐 Deployment to Vercel

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Automatic deployment on main branch pushes
4. Preview deployments for pull requests

## 🔒 Security Best Practices

- ✅ JWT token stored in localStorage
- ✅ CORS enabled on backend for Vercel domain
- ✅ All API calls use HTTPS in production
- ✅ Input validation on all forms
- ✅ Protected routes with auth checks

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚨 Troubleshooting

### API connection failed
- Check `VITE_API_BASE_URL` in `.env.local`
- Ensure backend is running
- Check CORS settings on backend

### WebSocket not connecting
- Verify `VITE_WS_URL` in `.env.local`
- Check WebSocket server is running
- Ensure Socket.io is installed

### Styles not applying
- Clear: `rm -rf node_modules && npm install`
- Rebuild: `npm run dev`
- Check Tailwind classes in `src/` files

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Commit changes: `git commit -m 'Add feature'`
3. Push branch: `git push origin feature/name`
4. Open pull request for review

## 📄 License

This project is **proprietary** to Middle East College and Burjeel Hospital for academic use only.

## 👥 Team

- **Developed by:** Seham Albulushi (20S20055)
- **Supervisor:** Puttaswamy M. R.
- **Institution:** Middle East College & Burjeel Hospital

---

**Version:** 1.0.0 | **Status:** Production Ready | **Last Updated:** April 2024
