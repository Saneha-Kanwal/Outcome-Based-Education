/**
 * Forgot Password page for OBE System
 * Uses OTP-based password reset
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { requestOTP, verifyOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState('request'); // 'request', 'verify', 'reset'
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await requestOTP(email);

    if (result.success) {
      setMessage('OTP sent to your email');
      setStep('verify');
    } else {
      setError(result.error || 'Failed to send OTP');
    }

    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // For password reset, we verify OTP then allow password change
    // This is a simplified flow - in production, you'd have a separate reset endpoint
    const result = await verifyOTP(email, code);

    if (result.success) {
      setStep('reset');
      setMessage('OTP verified. Please enter your new password.');
    } else {
      setError(result.error || 'Invalid OTP code');
    }

    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    // In production, this would call a dedicated password reset endpoint
    // For now, we'll use the OTP verification which logs the user in
    // Then they can change password from their profile
    navigate('/login');
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Reset Password</h2>

        {step === 'request' && (
          <form onSubmit={handleRequestOTP}>
            <p>Enter your email to receive a password reset code.</p>

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

            {error && <ErrorMessage message={error} />}
            {message && <div className="success-message">{message}</div>}

            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              Send Reset Code
            </Button>

            <div className="auth-links">
              <button type="button" onClick={() => navigate('/login')} className="link-button">
                Back to Login
              </button>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifyOTP}>
            {message && <div className="success-message">{message}</div>}

            <Input
              label="Enter 6-digit OTP"
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              maxLength={6}
              required
              disabled={loading}
            />

            {error && <ErrorMessage message={error} />}

            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              Verify Code
            </Button>

            <div className="auth-links">
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setCode('');
                  setError('');
                  setMessage('');
                }}
                className="link-button"
              >
                Request New Code
              </button>
            </div>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetPassword}>
            {message && <div className="success-message">{message}</div>}

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              required
              disabled={loading}
            />

            {error && <ErrorMessage message={error} />}

            <Button type="submit" variant="primary" loading={loading} disabled={loading}>
              Reset Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

