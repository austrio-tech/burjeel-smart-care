import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'PPP') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date';
  }
};

export const formatTime = (date, formatStr = 'p') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid time';
  }
};

export const formatDateTime = (date, formatStr = 'PPpp') => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    return 'Invalid date/time';
  }
};

export const formatRelativeTime = (date) => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    return 'Unknown time';
  }
};

export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatNumber = (value, decimals = 2) => {
  return parseFloat(value).toFixed(decimals);
};

export const formatPercentage = (value, decimals = 1) => {
  return `${parseFloat(value).toFixed(decimals)}%`;
};

export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  return str
    .split(' ')
    .map((word) => capitalizeFirstLetter(word))
    .join(' ');
};

export const truncate = (str, length = 50, suffix = '...') => {
  if (str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getInitials = (firstName, lastName = '') => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const formatAttendanceStatus = (status) => {
  const statusMap = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
  };
  return statusMap[status] || status;
};

export const getAttendanceColor = (status) => {
  const colorMap = {
    present: 'success',
    absent: 'danger',
    late: 'warning',
    excused: 'info',
  };
  return colorMap[status] || 'secondary';
};
