export default function Loader({
  size = 'md',
  text = 'Loading...',
  fullscreen = false,
  variant = 'spinner',
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  };

  const loader =
    variant === 'spinner' ? (
      <div className={`${sizeClasses[size]} border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
    ) : (
      <div className="flex gap-1">
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        {loader}
        {text && <p className="mt-4 text-secondary-600 font-medium">{text}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {loader}
      {text && <p className="mt-4 text-secondary-600 font-medium">{text}</p>}
    </div>
  );
}
