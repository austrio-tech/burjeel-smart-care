// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  PATIENT: 'patient',
  PHARMACIST: 'pharmacist',
  IT_STAFF: 'it_staff',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

// Reminder Status
export const REMINDER_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  FAILED: 'failed',
  DELIVERED: 'delivered',
};

// Reminder Frequency
export const REMINDER_FREQUENCY = {
  ONCE: 'once',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
};

// Reminder Channel
export const REMINDER_CHANNEL = {
  SMS: 'sms',
  EMAIL: 'email',
  PUSH: 'push',
  IN_APP: 'in_app',
};

// Message Types
export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system',
};

// Chat Status
export const CHAT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
};

// Alert Types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  PATIENTS: '/patients',
  REMINDERS: '/reminders',
  ATTENDANCE: '/attendance',
  CHAT: '/chat',
  APPOINTMENTS: '/appointments',
  REPORTS: '/reports',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  SHORT: 'MM/dd/yyyy',
  LONG: 'EEEE, MMMM dd, yyyy',
};

// Time Formats
export const TIME_FORMATS = {
  SHORT: 'h:mm a',
  LONG: 'h:mm:ss a',
  ISO: 'HH:mm:ss',
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
  MRN_MIN_LENGTH: 4,
  MRN_MAX_LENGTH: 20,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/csv',
    'application/vnd.ms-excel',
  ],
  ALLOWED_EXTENSIONS: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'csv', 'xls', 'xlsx'],
};

// Report Types
export const REPORT_TYPES = {
  ATTENDANCE: 'attendance',
  REMINDERS: 'reminders',
  APPOINTMENTS: 'appointments',
  PATIENT_SUMMARY: 'patient_summary',
};

// Report Formats
export const REPORT_FORMATS = {
  PDF: 'pdf',
  CSV: 'csv',
  EXCEL: 'excel',
  JSON: 'json',
};

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: 20,
  ALERT_DURATION: 5000,
  REQUEST_TIMEOUT: 10000,
  SOCKET_RECONNECT_DELAY: 1000,
};

// Cache Keys
export const CACHE_KEYS = {
  USER: 'user',
  CONVERSATIONS: 'conversations',
  PATIENTS: 'patients',
  REMINDERS: 'reminders',
};

// Feature Flags
export const FEATURES = {
  LIVE_CHAT: true,
  SMS_REMINDERS: true,
  EMAIL_REMINDERS: true,
  PUSH_NOTIFICATIONS: true,
  BULK_IMPORT: true,
  ANALYTICS: true,
  OFFLINE_MODE: false,
};

// App Configuration
export const APP_CONFIG = {
  NAME: import.meta.env.VITE_APP_NAME || 'Burjeel Smart Care',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
};

// Navigation Items
export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { label: 'Patients', path: '/admin/patients', icon: 'users' },
  { label: 'Reminders', path: '/admin/reminders', icon: 'bell' },
  { label: 'Attendance', path: '/admin/attendance', icon: 'check' },
  { label: 'Reports', path: '/admin/reports', icon: 'chart' },
  { label: 'Chat', path: '/admin/chat', icon: 'message' },
];

export const PATIENT_NAV_ITEMS = [
  { label: 'Dashboard', path: '/patient/dashboard', icon: 'dashboard' },
  { label: 'Appointments', path: '/patient/appointments', icon: 'calendar' },
  { label: 'Messages', path: '/patient/chat', icon: 'message' },
];
