# Burjeel Smart Care - Installation & Quick Start Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
# Create .env.local file with:
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000
VITE_APP_NAME=Burjeel Smart Care
```

### Step 3: Start Development Server
```bash
npm run dev
```

✅ App is now running on `http://localhost:5173`

---

## 📖 Available Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally

# Linting (optional - testing skipped as per specs)
npm run lint         # Check code quality
```

---

## 🔐 Demo Credentials

Use these credentials to test the application:

**Admin Account:**
- Email: `admin@hospital.com`
- Password: `password123`

**Patient Account:**
- Email: `patient@hospital.com`
- Password: `password123`

---

## 🎯 Project Features

### ✅ Completed
- ✓ Modern React + Vite setup with HMR
- ✓ Responsive design (mobile, tablet, desktop)
- ✓ Smooth animations and transitions
- ✓ Context API state management
- ✓ Authentication system with JWT
- ✓ Protected routes with role-based access
- ✓ Complete component library
- ✓ API service layer with Axios interceptors
- ✓ WebSocket integration for live chat
- ✓ Charts and data visualization
- ✓ Form validation and error handling
- ✓ Utility functions for formatting and validation
- ✓ Environment variable configuration
- ✓ Production-ready build optimization
- ✓ ESLint configuration for code quality
- ✓ Tailwind CSS with custom theme

### 📱 Pages Implemented
- **Login Page** – Beautiful authentication interface
- **Admin Dashboard** – Patient management, charts, metrics
- **Patient Dashboard** – Appointments and health portal
- **Attendance Page** – Attendance tracking and reporting
- **Reminder Page** – SMS/Email reminder scheduling
- **Chat Page** – Real-time messaging with WebSocket
- **Reports Page** – Analytics and statistics

### 🧩 Components Created
- Layout components (Navbar, Sidebar, Footer)
- UI components (Button, Input, Select, Modal, Card, Table, Badge, Alert, Loader)
- Forms with validation
- Charts (Bar, Line, Pie)
- Responsive grid system

---

## 📂 File Organization

### Services (`src/services/`)
All API calls organized by feature:
- `api.js` – Axios instance with interceptors
- `authService.js` – Login, logout, token management
- `patientService.js` – Patient CRUD operations
- `reminderService.js` – Reminder scheduling
- `attendanceService.js` – Attendance tracking
- `chatService.js` – WebSocket and messaging

### Utilities (`src/utils/`)
Helper functions for common tasks:
- `formatters.js` – Date, time, currency, number formatting
- `validators.js` – Form validation rules
- `constants.js` – App-wide constants and configuration

### Contexts (`src/contexts/`)
Global state management:
- `AuthContext.jsx` – Authentication state
- `AlertContext.jsx` – Notifications
- `ChatContext.jsx` – Real-time messaging

### Hooks (`src/hooks/`)
Custom React hooks:
- `useAuth()` – Access auth context
- `useFetch()` – Data fetching with loading states
- `useSocket()` – Access chat context

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Vercel auto-detects Vite setup

3. **Set Environment Variables:**
- In Vercel dashboard, go to Settings → Environment Variables
- Add:
  - `VITE_API_BASE_URL=https://api.burjeel.com/api`
  - `VITE_WS_URL=wss://api.burjeel.com`

4. **Deploy:**
- Vercel automatically builds and deploys on push
- Your app is live! 🎉

---

## 🛠 Development Workflow

### Adding a New Page

1. **Create page component** in `src/pages/NewPage.jsx`:
```jsx
export default function NewPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">New Page</h1>
      {/* Content */}
    </div>
  );
}
```

2. **Add route** in `src/App.jsx`:
```jsx
<Route path="/admin/new-page" element={<NewPage />} />
```

3. **Add navigation** in `src/utils/constants.js`:
```javascript
{ label: 'New Page', path: '/admin/new-page', icon: FiIcon },
```

### Adding a New Component

1. **Create component** in `src/components/common/NewComponent.jsx`
2. **Export and use** in other components
3. **Add props** documentation in component

### Adding API Endpoints

1. **Create service** in `src/services/newService.js`:
```javascript
import api from './api';

export const getNewData = async () => {
  const response = await api.get('/endpoint');
  return response;
};
```

2. **Use in component:**
```jsx
import * as newService from '../services/newService';

const [data, setData] = useState([]);
useEffect(() => {
  newService.getNewData().then(setData);
}, []);
```

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { 600: '#your-color' },
  secondary: { 900: '#your-color' },
}
```

### Add Animations
Edit `tailwind.config.js`:
```javascript
animation: {
  'custom': 'customKeyframe 0.5s ease-out',
}
```

### Change API Base URL
Update `.env.local`:
```
VITE_API_BASE_URL=https://your-api.com
```

---

## 📚 Resources

- [React 18 Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [Socket.io](https://socket.io)
- [Recharts](https://recharts.org)

---

## ❓ Troubleshooting

### Port 5173 already in use
```bash
# Kill process on port 5173, or use:
npm run dev -- --port 3000
```

### Module not found error
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Hot reload not working
```bash
# Restart dev server
npm run dev
```

### API requests failing
- Check backend is running
- Verify `VITE_API_BASE_URL` in `.env.local`
- Check CORS settings on backend

---

## 📞 Support

For questions or issues:
1. Check the [DEVELOPMENT.md](./DEVELOPMENT.md) guide
2. Review the README in project root
3. Contact: support@burjeel.com

---

**Happy coding! 🚀**
