export default function Card({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  onClick,
  ...props
}) {
  const variantClasses = {
    default: 'bg-white border border-secondary-200',
    elevated: 'bg-white shadow-lg',
    outlined: 'bg-white border-2 border-primary-600',
    ghost: 'bg-secondary-50',
  };

  const hoverClass = hoverable ? 'hover:shadow-lg cursor-pointer transition-shadow' : '';

  return (
    <div
      className={`rounded-lg p-6 ${variantClasses[variant]} ${hoverClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
