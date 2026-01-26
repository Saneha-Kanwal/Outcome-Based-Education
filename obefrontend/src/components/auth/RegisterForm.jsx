/**
 * Registration form component for OBE System
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import './RegisterForm.css';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.email,
      formData.password,
      formData.first_name,
      formData.last_name
    );

    if (result.success) {
      onSuccess?.(result.user);
    } else {
      setError(result.error || 'Registration failed');
    }

    setLoading(false);
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>

      <Input
        label="First Name"
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="Enter your first name"
        required
        disabled={loading}
      />

      <Input
        label="Last Name"
        type="text"
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Enter your last name"
        required
        disabled={loading}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email"
        required
        disabled={loading}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Enter your password (min 8 characters)"
        required
        disabled={loading}
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm your password"
        required
        disabled={loading}
      />

      {error && <ErrorMessage message={error} />}

      <Button type="submit" variant="primary" loading={loading} disabled={loading}>
        Register
      </Button>

      <div className="auth-links">
        <button type="button" onClick={onSwitchToLogin} className="link-button">
          Already have an account? Login
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;

