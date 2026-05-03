# API Integration Guide

## Overview

This guide covers how the Burjeel Smart Care frontend integrates with the backend API.

## API Configuration

### Base URL
```javascript
// src/services/api.js
const baseURL = import.meta.env.VITE_API_BASE_URL
// Development: http://localhost:8000/api
// Production: https://api.burjeel.com/api
```

### Timeout
- Default: 10,000ms (10 seconds)
- Configurable per request

### Authentication
- Method: JWT (JSON Web Tokens)
- Storage: localStorage (key: `authToken`)
- Header: `Authorization: Bearer {token}`

---

## Request/Response Interceptors

### Request Interceptor
Automatically adds JWT token to all requests:
```javascript
// Adds to every request header:
Authorization: Bearer ${token}
```

### Response Interceptor
Handles authentication errors:
```javascript
// On 401 (Unauthorized):
1. Clear localStorage auth data
2. Reset auth context
3. Redirect to /login
```

---

## Authentication API

### Login
```javascript
POST /auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  user: {
    id: string,
    email: string,
    role: 'admin' | 'patient' | 'pharmacist' | 'it_staff',
    name: string
  }
}
```

### Logout
```javascript
POST /auth/logout
Response: { success: true }
```

### Validate Token
```javascript
GET /auth/validate
Response: {
  valid: boolean,
  user: { /* user data */ }
}
```

### Refresh Token
```javascript
POST /auth/refresh
Response: { token: string }
```

### Change Password
```javascript
POST /auth/change-password
Body: {
  currentPassword: string,
  newPassword: string
}
Response: { success: true }
```

### Reset Password
```javascript
POST /auth/reset-password
Body: { email: string }
Response: { message: string }
```

### Verify Reset Token
```javascript
POST /auth/verify-reset-token
Body: { token: string }
Response: { valid: boolean }
```

### Confirm Password Reset
```javascript
POST /auth/confirm-reset
Body: {
  token: string,
  newPassword: string
}
Response: { success: true }
```

---

## Patient API

### Get All Patients
```javascript
GET /patients?page=1&limit=20&search=query
Response: {
  data: [
    {
      id: string,
      name: string,
      email: string,
      phone: string,
      dob: date,
      emiratesId: string,
      medicalRecordNumber: string,
      status: 'active' | 'inactive',
      createdAt: date
    }
  ],
  total: number,
  page: number,
  limit: number
}
```

### Get Patient by ID
```javascript
GET /patients/{id}
Response: { /* patient object */ }
```

### Create Patient
```javascript
POST /patients
Body: {
  name: string,
  email: string,
  phone: string,
  dob: date,
  emiratesId: string,
  gender: 'M' | 'F'
}
Response: { id: string, /* ... */ }
```

### Update Patient
```javascript
PUT /patients/{id}
Body: { /* patient fields */ }
Response: { /* updated patient */ }
```

### Delete Patient
```javascript
DELETE /patients/{id}
Response: { success: true }
```

### Search Patients
```javascript
GET /patients/search?query=name
Response: { data: [] }
```

### Get Patient Appointments
```javascript
GET /patients/{id}/appointments
Response: { data: [] }
```

### Get Patient Medical History
```javascript
GET /patients/{id}/medical-history
Response: { data: [] }
```

### Bulk Import Patients
```javascript
POST /patients/import
Body: FormData with CSV file
Response: {
  imported: number,
  errors: [{ row: number, error: string }]
}
```

---

## Reminder API

### Get Reminders
```javascript
GET /reminders?status=pending&page=1
Response: { data: [], total: number }
```

### Create Reminder
```javascript
POST /reminders
Body: {
  patientId: string,
  type: 'appointment' | 'medication' | 'followup',
  frequency: 'once' | 'daily' | 'weekly' | 'monthly',
  channel: 'sms' | 'email' | 'push',
  message: string,
  scheduledFor: date
}
Response: { id: string, /* ... */ }
```

### Update Reminder
```javascript
PUT /reminders/{id}
Body: { /* reminder fields */ }
Response: { /* updated reminder */ }
```

### Delete Reminder
```javascript
DELETE /reminders/{id}
Response: { success: true }
```

### Send Manual Reminder
```javascript
POST /reminders/{id}/send
Response: { success: true, sentAt: date }
```

### Schedule Reminder
```javascript
POST /reminders/{id}/schedule
Body: { scheduledFor: date }
Response: { success: true }
```

### Get Patient Reminders
```javascript
GET /patients/{patientId}/reminders
Response: { data: [] }
```

### Send Bulk Reminders
```javascript
POST /reminders/bulk-send
Body: { reminderIds: [string] }
Response: { sent: number, failed: number }
```

---

## Attendance API

### Mark Attendance
```javascript
POST /attendance/mark
Body: {
  patientId: string,
  status: 'present' | 'absent' | 'late' | 'excused',
  timestamp: date,
  notes?: string
}
Response: { id: string, /* ... */ }
```

### Get Attendance Log
```javascript
GET /attendance/log?from=date&to=date&page=1
Response: { data: [], total: number }
```

### Get Patient Attendance
```javascript
GET /patients/{id}/attendance
Response: { data: [] }
```

### Get Attendance Stats
```javascript
GET /attendance/stats?from=date&to=date
Response: {
  present: number,
  absent: number,
  late: number,
  attendanceRate: number
}
```

### Get Attendance Report
```javascript
GET /attendance/report?from=date&to=date&format=json
Response: { /* report data */ }
```

### Export Attendance Data
```javascript
GET /attendance/export?format=csv|excel&from=date&to=date
Response: File download
```

### Bulk Mark Attendance
```javascript
POST /attendance/bulk-mark
Body: {
  records: [
    { patientId: string, status: string }
  ]
}
Response: { marked: number, failed: number }
```

---

## Chat/Messaging API

### Get Conversations
```javascript
GET /chat/conversations?page=1
Response: {
  data: [
    {
      id: string,
      participantId: string,
      participantName: string,
      lastMessage: string,
      unreadCount: number,
      updatedAt: date
    }
  ]
}
```

### Get Messages
```javascript
GET /chat/conversations/{conversationId}/messages?page=1
Response: {
  data: [
    {
      id: string,
      senderId: string,
      senderName: string,
      content: string,
      timestamp: date,
      isRead: boolean,
      attachments?: [{ url: string, name: string }]
    }
  ]
}
```

### Send Message (REST)
```javascript
POST /chat/messages
Body: {
  conversationId: string,
  content: string,
  attachments?: [file]
}
Response: { id: string, /* ... */ }
```

### Create Conversation
```javascript
POST /chat/conversations
Body: { participantId: string }
Response: { id: string, /* ... */ }
```

### Search Messages
```javascript
GET /chat/search?query=text
Response: { data: [] }
```

### Mark Messages as Read
```javascript
PUT /chat/conversations/{conversationId}/read
Response: { success: true }
```

### Delete Message
```javascript
DELETE /chat/messages/{id}
Response: { success: true }
```

### Edit Message
```javascript
PUT /chat/messages/{id}
Body: { content: string }
Response: { /* updated message */ }
```

### Upload Attachment
```javascript
POST /chat/attachments
Body: FormData with file
Response: { url: string, name: string }
```

### Get Chat Users
```javascript
GET /chat/users?search=name
Response: { data: [] }
```

### Block User
```javascript
POST /chat/block/{userId}
Response: { success: true }
```

### Unblock User
```javascript
DELETE /chat/block/{userId}
Response: { success: true }
```

---

## WebSocket Events (Real-time Chat)

### Connection
```javascript
socket.on('connect', () => {
  console.log('Connected to WebSocket');
});
```

### New Message
```javascript
socket.on('message', (data) => {
  // data: { senderId, content, timestamp, attachments }
});
```

### User Typing
```javascript
socket.on('user_typing', (data) => {
  // data: { userId, isTyping }
});
```

### Disconnect
```javascript
socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket');
});
```

---

## Error Handling

### HTTP Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized (auto-logout)
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

### Error Response Format
```javascript
{
  error: {
    code: string,
    message: string,
    details?: object
  }
}
```

### Frontend Error Handling
```javascript
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (error) {
  if (error.response?.status === 401) {
    // Auto-handled by interceptor
  } else {
    showAlert(error.response?.data?.error?.message);
  }
}
```

---

## Rate Limiting

- **Limit**: 100 requests per minute per IP
- **Headers**: 
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: remaining requests
  - `X-RateLimit-Reset`: Unix timestamp

---

## CORS Configuration

**Allowed Origins (Production):**
- `https://smartcare.burjeel.com`
- `https://admin.burjeel.com`

**Allowed Methods:**
- GET, POST, PUT, DELETE, PATCH, OPTIONS

**Allowed Headers:**
- Content-Type
- Authorization

---

## Caching Strategy

### Frontend Cache
- Auth token: localStorage (until logout)
- User data: 5-minute cache
- Patient list: 10-minute cache
- Messages: In-memory cache

### Cache Invalidation
```javascript
// Manually clear cache
localStorage.removeItem('authToken');
// Or use invalidation API calls
refetch();
```

---

## Testing API Integration

### Using the Frontend
1. Login with demo credentials
2. Check Network tab in DevTools
3. Monitor API calls and responses

### Using cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"password123"}'

# Get Patients (with token)
curl -H "Authorization: Bearer {token}" \
  http://localhost:8000/api/patients
```

### Using Postman
1. Import API collection
2. Set environment variables
3. Run requests

---

## Pagination

All list endpoints support pagination:
```javascript
GET /endpoint?page=1&limit=20&sort=-createdAt
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field (prefix `-` for descending)
- `search`: Search query

---

## Best Practices

✅ **DO:**
- Use service layer for API calls
- Handle all possible errors
- Show loading states
- Cache when appropriate
- Use pagination for large datasets
- Validate input before sending

❌ **DON'T:**
- Make API calls directly in components
- Ignore error responses
- Hardcode API URLs
- Store sensitive data in localStorage
- Make too many concurrent requests
- Forget to handle loading states

---

## Common Issues & Solutions

### 401 Unauthorized
- Token expired → Auto-logout triggered
- Invalid credentials → Check email/password
- Missing token header → Check interceptor

### CORS Error
- Backend not allowing origin → Check CORS config
- Wrong API URL → Verify VITE_API_BASE_URL
- Preflight failed → Check allowed methods

### WebSocket Connection Failed
- Backend not running → Start backend server
- Wrong URL → Check VITE_WS_URL
- Firewall blocking → Check firewall rules

---

## Backend Setup Requirements

For the frontend to work properly, ensure backend has:

- ✅ Authentication endpoints
- ✅ Patient CRUD endpoints
- ✅ Reminder endpoints
- ✅ Attendance endpoints
- ✅ Chat/messaging endpoints
- ✅ WebSocket server
- ✅ CORS enabled
- ✅ JWT validation
- ✅ Error handling
- ✅ Input validation

---

**Last Updated:** April 2024
