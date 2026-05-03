# System Architecture

## 🏗 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Burjeel Smart Care Frontend              │
├─────────────────────────────────────────────────────────────┤
│  React 18 + React Router                                    │
│  ├─ Pages (7 pages)                                         │
│  ├─ Components (11 core UI components)                      │
│  └─ Layouts (Navbar, Sidebar, Footer)                       │
├─────────────────────────────────────────────────────────────┤
│  Context API State Management (3 contexts)                  │
│  ├─ AuthContext (user, token, login/logout)                │
│  ├─ AlertContext (notifications)                           │
│  └─ ChatContext (messaging state)                          │
├─────────────────────────────────────────────────────────────┤
│  Custom Hooks (3 hooks)                                     │
│  ├─ useAuth() - Access auth context                        │
│  ├─ useFetch() - Data fetching                             │
│  └─ useSocket() - Access chat context                      │
├─────────────────────────────────────────────────────────────┤
│  Service Layer (6 services)                                 │
│  ├─ api.js (Axios instance + interceptors)                 │
│  ├─ authService.js (Login, token management)               │
│  ├─ patientService.js (Patient CRUD)                       │
│  ├─ reminderService.js (Reminder scheduling)               │
│  ├─ attendanceService.js (Attendance tracking)             │
│  └─ chatService.js (WebSocket + messaging)                 │
├─────────────────────────────────────────────────────────────┤
│  External APIs & Services                                   │
│  ├─ Backend REST API (http://api.burjeel.com)              │
│  ├─ WebSocket Server (ws://api.burjeel.com)                │
│  └─ Third-party Services (optional)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Component Hierarchy

```
App.jsx
├─ <BrowserRouter>
├─ <AuthProvider>
├─ <AlertProvider>
├─ <ChatProvider>
└─ <Routes>
   ├─ <LoginPage />
   ├─ <Layout>
   │  ├─ <Navbar />
   │  ├─ <Sidebar />
   │  ├─ <MainContent>
   │  │  ├─ <AdminDashboard />
   │  │  │  ├─ <Card /> (metrics)
   │  │  │  ├─ <BarChart /> (Recharts)
   │  │  │  ├─ <LineChart /> (Recharts)
   │  │  │  ├─ <Table /> (patients)
   │  │  │  └─ <Modal /> (add patient)
   │  │  ├─ <PatientDashboard />
   │  │  ├─ <AttendancePage />
   │  │  ├─ <ReminderPage />
   │  │  ├─ <ChatPage />
   │  │  └─ <ReportsPage />
   │  └─ <Footer />
   └─ <AlertContainer /> (global alerts)
```

---

## 🔄 Data Flow Architecture

### Authentication Flow
```
User Input (Email/Password)
    ↓
LoginPage.jsx
    ↓
useAuth() hook
    ↓
AuthContext.dispatch(LOGIN_START)
    ↓
authService.login()
    ↓
api.post('/auth/login')
    ↓
Backend validates & returns JWT
    ↓
AuthContext.dispatch(LOGIN_SUCCESS)
    ↓
Store in localStorage
    ↓
Redirect to dashboard
    ↓
Future requests: api.get() adds Authorization header
```

### API Request Flow
```
Component
    ↓
useEffect → service.getData()
    ↓
Service method: api.get('/endpoint')
    ↓
Request Interceptor: Adds Authorization header
    ↓
HTTP GET to Backend
    ↓
Backend processes & responds
    ↓
Response Interceptor: Checks for errors (401 → logout)
    ↓
Component receives data
    ↓
setState(data) → Re-render
```

### Real-time Chat Flow
```
User types message in ChatPage
    ↓
handleSendMessage()
    ↓
socket.emit('message', { conversationId, content })
    ↓
Backend receives message
    ↓
Backend broadcasts to recipient
    ↓
socket.on('message') listener triggered
    ↓
ChatContext.dispatch(ADD_MESSAGE)
    ↓
UI updates with new message
```

---

## 🔐 Authentication Architecture

### JWT Token Flow
```
1. LOGIN
   User inputs credentials
   → authService.login(email, password)
   → Backend validates & returns { token, user }
   → Store token in localStorage
   → Store user in AuthContext

2. AUTHENTICATED REQUESTS
   Every request includes header:
   Authorization: Bearer {token}
   (Automatically added by request interceptor)

3. TOKEN EXPIRY
   Server returns 401 Unauthorized
   → Response interceptor catches
   → Clears localStorage
   → Resets AuthContext
   → Redirects to /login

4. LOGOUT
   User clicks logout
   → authService.logout()
   → Clear localStorage
   → Reset AuthContext
   → Redirect to /login
```

### Protected Routes
```javascript
const roles = {
  'admin': ['/admin/*'],
  'patient': ['/patient/*'],
  'pharmacist': ['/pharmacist/*'],
  'it_staff': ['/it_staff/*']
};

// In App.jsx:
<Route 
  path="/admin/*" 
  element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
/>
```

---

## 📊 State Management Architecture

### AuthContext
```javascript
Initial State: {
  user: null,
  token: null,
  loading: false,
  error: null
}

Actions:
- LOGIN_START: Set loading = true
- LOGIN_SUCCESS: Set user & token, loading = false
- LOGIN_ERROR: Set error, loading = false
- LOGOUT: Clear user & token
- RESTORE_TOKEN: Restore from localStorage
- UPDATE_USER: Update user data

Provided Functions:
- login(email, password) → async
- logout() → void
- isAuthenticated → boolean
```

### AlertContext
```javascript
Initial State: {
  alerts: []
}

Actions:
- ADD_ALERT: Add notification
- REMOVE_ALERT: Remove by id
- CLEAR_ALERTS: Clear all

Convenience Methods:
- success(message)
- error(message)
- warning(message)
- info(message)
- addAlert(type, message, duration)
```

### ChatContext
```javascript
Initial State: {
  conversations: [],
  currentConversation: null,
  messages: [],
  connected: false,
  loading: false,
  error: null
}

Actions:
- SET_LOADING, SET_ERROR, SET_CONNECTED
- SET_MESSAGES, ADD_MESSAGE
- SET_CURRENT_CONVERSATION

WebSocket Events:
- message (new message received)
- user_typing (user typing indicator)
- disconnect (connection lost)
- connect (connection established)
```

---

## 🌐 API Layer Architecture

### Axios Instance Configuration
```javascript
// src/services/api.js
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Request Interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Auto-logout
    }
    return Promise.reject(error);
  }
);
```

### Service Layer Pattern
```javascript
// Each service file imports api instance
// All service methods use api for HTTP calls
// Services are stateless - pure functions
// Services handle API logic only

// Example: src/services/patientService.js
export const getPatients = (page, limit) => 
  api.get('/patients', { params: { page, limit } });

export const createPatient = (data) =>
  api.post('/patients', data);

export const deletePatient = (id) =>
  api.delete(`/patients/${id}`);
```

---

## 🧩 Component Architecture

### Component Categories

#### 1. Layout Components
- Purpose: Structural layout
- Files: Layout.jsx, Navbar.jsx, Sidebar.jsx, Footer.jsx
- Props: children for content injection
- State: Local state for sidebar toggle, user dropdown

#### 2. Page Components
- Purpose: Full-page features
- Files: LoginPage.jsx, AdminDashboard.jsx, etc.
- Props: None (route params from router)
- State: Heavy state for page data
- Services: Multiple service calls for data

#### 3. Common UI Components
- Purpose: Reusable UI elements
- Files: Button.jsx, Input.jsx, Modal.jsx, Card.jsx, etc.
- Props: Extensive customization props
- State: Local UI state (focus, open, etc.)
- Composition: Build complex UIs from components

### Component Design Patterns

#### Button Component
```javascript
<Button 
  variant="primary"           // primary, secondary, outline, danger
  size="lg"                  // sm, md, lg
  disabled={false}
  loading={false}
  icon={FiPlus}             // Optional icon
  onClick={handleClick}
>
  Click Me
</Button>
```

#### Modal Component
```javascript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Dialog Title"
  size="lg"                 // sm, md, lg, xl
  footer={<ModalFooter />}
>
  Modal content here
</Modal>
```

#### Table Component
```javascript
<Table
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: (val) => <Link>{val}</Link> }
  ]}
  data={items}
  selectable={true}
  striped={true}
  hover={true}
  onRowClick={(row) => {}}
/>
```

---

## 🔌 WebSocket Architecture

### Socket.io Integration
```
1. CONNECTION
   socket = io('ws://localhost:8000', {
     auth: { token: localStorage.getItem('authToken') }
   });

2. LISTENERS
   socket.on('message', handleNewMessage);
   socket.on('user_typing', handleTyping);
   socket.on('disconnect', handleDisconnect);

3. EMITTERS
   socket.emit('message', { conversationId, content });
   socket.emit('user_typing', { isTyping: true });

4. AUTO-RECONNECT
   Socket.io automatically reconnects on disconnect
   with exponential backoff strategy
```

### Message Flow
```
User A Sends Message
    ↓
ChatPage: handleSendMessage()
    ↓
socket.emit('message', payload)
    ↓
Backend receives & saves message
    ↓
Backend broadcasts to recipients
    ↓
User B receives via socket.on('message')
    ↓
ChatContext.dispatch(ADD_MESSAGE)
    ↓
UI updates instantly
```

---

## 🎨 Styling Architecture

### Tailwind CSS Custom Theme
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: { 600: '#0ea5e9' },
      secondary: { 900: '#111827' },
      success: { 600: '#10b981' },
      // ... more colors
    },
    animation: {
      'fade-in': 'fadeIn 0.3s ease-in',
      'slide-in-left': 'slideInLeft 0.5s ease-out',
      // ... more animations
    }
  }
};
```

### CSS Architecture
```
├─ Global Styles (src/index.css)
│  ├─ Tailwind directives (@tailwind)
│  ├─ Custom utilities (.btn-primary, .input-base)
│  ├─ Animations (@keyframes)
│  └─ Scrollbar styling
│
├─ Component Styles (component.css)
│  └─ Component-specific overrides (minimal)
│
└─ Inline Styles (className)
   └─ Tailwind classes directly in JSX
```

---

## 🚀 Build & Deployment Architecture

### Vite Build Pipeline
```
Source Code (src/)
    ↓
Vite transformer
    ↓
Code splitting (manual chunks)
    ├─ react chunk
    ├─ charts chunk
    ├─ icons chunk
    └─ main chunk
    ↓
Tree shaking (remove unused code)
    ↓
CSS minification + Tailwind purge
    ↓
Terser minification
    ↓
dist/ folder (optimized build)
```

### Deployment Pipeline
```
Local Development
    ↓
GitHub commit
    ↓
Push to main branch
    ↓
GitHub webhook → Vercel
    ↓
Vercel builds: npm run build
    ↓
Vercel deploys to CDN
    ↓
Auto-revert on build failure
    ↓
Production live 🎉
```

---

## 📈 Performance Architecture

### Code Splitting
```javascript
// Manual chunks in vite.config.js
manualChunks: {
  'react': ['react', 'react-dom', 'react-router-dom'],
  'charts': ['recharts'],
  'icons': ['react-icons'],
  'http': ['axios'],
  'socket': ['socket.io-client']
}
```

### Lazy Loading
```javascript
// Route-based code splitting
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
<Suspense fallback={<Loader />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
</Suspense>
```

### Caching Strategy
```
Browser Cache:
├─ Static files (index.html, CSS, JS)
│  TTL: 1 year (versioned filenames)
├─ Images & fonts
│  TTL: 30 days
└─ API responses
   TTL: Custom per endpoint

CDN Cache (Vercel):
├─ All static files
└─ Auto-invalidate on deploy
```

---

## 🔍 Monitoring & Debugging

### Error Tracking
```javascript
// Errors logged to:
1. Browser console (development)
2. Sentry (production - optional)
3. User feedback (in-app alerts)
```

### Performance Monitoring
```javascript
// Web Vitals
reportWebVitals(console.log);

// Network monitoring
DevTools → Network tab

// State debugging
React DevTools → Components/Hooks
```

---

## 📋 Technology Stack Breakdown

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 18+ | Server-side execution |
| **Framework** | React | 18.3 | UI rendering |
| **Build Tool** | Vite | 5.2 | Module bundler |
| **Router** | React Router | 6.24 | Client-side routing |
| **State** | Context API | Built-in | Global state management |
| **HTTP** | Axios | 1.7 | API requests |
| **Real-time** | Socket.io | 4.7 | WebSocket communication |
| **Styling** | Tailwind CSS | 3.4 | Utility-first CSS |
| **Charts** | Recharts | 2.12 | Data visualization |
| **Icons** | React Icons | 5.2 | Icon library |
| **Dates** | date-fns | 3.3 | Date utilities |
| **Linting** | ESLint | Latest | Code quality |
| **Formatting** | Prettier | Latest | Code formatting |

---

## 🎯 Design Principles

1. **Separation of Concerns**
   - Components: UI only
   - Services: API logic
   - Contexts: State management
   - Utils: Helper functions

2. **Reusability**
   - Common components for UI consistency
   - Custom hooks for logic sharing
   - Service layer for API abstraction

3. **Performance**
   - Code splitting by route & feature
   - Lazy loading components
   - Efficient state management
   - Optimized images & assets

4. **Maintainability**
   - Clear file structure
   - Consistent naming conventions
   - Comprehensive documentation
   - Error handling throughout

5. **Security**
   - JWT authentication
   - Secure token storage
   - CORS validation
   - Input validation
   - Protected routes

---

**Last Updated:** April 2024  
**Architecture Version:** 1.0  
**Status:** Production Ready
