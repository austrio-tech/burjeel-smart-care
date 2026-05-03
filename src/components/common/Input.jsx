import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      type = 'text',
      placeholder,
      disabled = false,
      required = false,
      icon: Icon,
      clearable = false,
      onClear,
      value,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-secondary-700 mb-2">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />}

          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            value={value}
            onChange={onChange}
            className={`
              w-full px-4 py-3 ${Icon ? 'pl-10' : ''} border border-secondary-200 rounded-lg
              text-secondary-900 placeholder-secondary-400
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              hover:border-secondary-300
              disabled:bg-secondary-50 disabled:cursor-not-allowed
              ${error ? 'border-danger ring-1 ring-danger' : ''}
              ${className}
            `}
            {...props}
          />

          {clearable && value && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
              aria-label="Clear input"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>

        {error && <p className="text-sm text-danger mt-1">{error}</p>}
        {hint && !error && <p className="text-sm text-secondary-500 mt-1">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
