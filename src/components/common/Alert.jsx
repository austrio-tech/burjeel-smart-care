import { useEffect, useState } from 'react';
import { FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

export default function Alert({
  type = 'info',
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  title,
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-l-4 border-green-500',
      textColor: 'text-green-800',
      icon: FiCheck,
      iconColor: 'text-green-500',
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-l-4 border-red-500',
      textColor: 'text-red-800',
      icon: FiAlertCircle,
      iconColor: 'text-red-500',
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-4 border-yellow-500',
      textColor: 'text-yellow-800',
      icon: FiAlertCircle,
      iconColor: 'text-yellow-500',
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-4 border-blue-500',
      textColor: 'text-blue-800',
      icon: FiInfo,
      iconColor: 'text-blue-500',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        ${config.bgColor}
        ${config.borderColor}
        ${config.textColor}
        p-4 rounded-lg shadow-md animate-slide-down
        flex items-start gap-3
      `}
      role="alert"
    >
      <Icon className={`flex-shrink-0 ${config.iconColor}`} size={20} />
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className={`flex-shrink-0 hover:opacity-70 transition-opacity`}
        aria-label="Close alert"
      >
        <FiX size={20} />
      </button>
    </div>
  );
}
