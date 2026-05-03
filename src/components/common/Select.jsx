import { forwardRef } from 'react';

const Select = forwardRef(
  (
    {
      label,
      error,
      hint,
      options = [],
      placeholder = 'Select an option',
      disabled = false,
      required = false,
      value,
      onChange,
      multiple = false,
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

        <select
          ref={ref}
          disabled={disabled}
          value={value}
          onChange={onChange}
          multiple={multiple}
          className={`
            w-full px-4 py-3 border border-secondary-200 rounded-lg
            text-secondary-900 bg-white
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            hover:border-secondary-300
            disabled:bg-secondary-50 disabled:cursor-not-allowed
            ${error ? 'border-danger ring-1 ring-danger' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <p className="text-sm text-danger mt-1">{error}</p>}
        {hint && !error && <p className="text-sm text-secondary-500 mt-1">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
