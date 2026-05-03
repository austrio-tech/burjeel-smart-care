import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useContext } from 'react';
import { AlertContext } from '../contexts/AlertContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { validateRequired, validatePassword } from '../utils/validators';
import { FiUser, FiLock } from 'react-icons/fi';
import { APP_CONFIG } from '../utils/constants';

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useContext(AlertContext);

  const validateForm = () => {
    const newErrors = {};

    if (!validateRequired(formData.username)) {
      newErrors.username = 'Username is required';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await login(formData.username, formData.password);

      if (result.success) {
        showSuccess('Login successful!');
        navigate('/');
      } else {
        showError(result.error || 'Login failed');
      }
    } catch (err) {
      showError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
              B
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{APP_CONFIG.NAME}</h1>
          <p className="text-primary-100">Intelligent Patient Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Sign In</h2>

            {/* Username Field */}
            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              error={errors.username}
              icon={FiUser}
              required
            />

            {/* Password Field */}
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              icon={FiLock}
              required
            />

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-secondary-700">Remember me</span>
              </label>
              <a href="#forgot" className="text-primary-600 hover:text-primary-700 font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-secondary-600 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-primary-100 text-sm mt-8">
          © 2024 {APP_CONFIG.NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
