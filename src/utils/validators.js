export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return {
    score: strength,
    level: strength <= 2 ? 'weak' : strength <= 4 ? 'medium' : 'strong',
  };
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateRequired = (value) => {
  return value && value.trim() !== '';
};

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength;
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateDateRange = (startDate, endDate) => {
  return new Date(startDate) <= new Date(endDate);
};

export const validateFutureDate = (date) => {
  return new Date(date) > new Date();
};

export const validatePastDate = (date) => {
  return new Date(date) < new Date();
};

export const validateNumberRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validateFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeInMB) => {
  return file.size <= maxSizeInMB * 1024 * 1024;
};

export const validateEmiratesId = (id) => {
  const idRegex = /^\d{3}-\d{4}-\d{6}-\d{1}$/;
  return idRegex.test(id);
};

export const validateNationalId = (id) => {
  // Generic national ID validation (adjust based on requirements)
  return id && id.length >= 5;
};

export const validateMRN = (mrn) => {
  // Medical Record Number validation
  return mrn && mrn.length >= 4;
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = values[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
    }

    if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format';
    }

    if (rule.minLength && value && !validateMinLength(value, rule.minLength)) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value && !validateMaxLength(value, rule.maxLength)) {
      errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = `${field} format is invalid`;
    }

    if (rule.custom && value) {
      const customError = rule.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return errors;
};
