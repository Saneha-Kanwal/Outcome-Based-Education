/**
 * Login form component for OBE System
 * Supports email/password, Google OAuth, and OTP login
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import GoogleOAuthButton from './GoogleOAuthButton';
import './LoginForm.css';

const LoginForm = ({ onSuccess, onSwitchToOTP, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.user) {
        // Small delay to ensure state is updated before redirect
        setTimeout(() => {
          onSuccess?.(result.user);
        }, 50);
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login to OBE System</h2>

      <Input
        label="Email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        disabled={loading}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        disabled={loading}
      />

      {error && <ErrorMessage message={error} />}

      <Button type="submit" variant="primary" loading={loading} disabled={loading}>
        Login
      </Button>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <GoogleOAuthButton onSuccess={onSuccess} />

      <div className="auth-links">
        <button type="button" onClick={onSwitchToOTP} className="link-button">
          Login with OTP
        </button>
        <span>|</span>
        <button type="button" onClick={onSwitchToRegister} className="link-button">
          Create Account
        </button>
      </div>
    </form>
  );
};

export default LoginForm;

