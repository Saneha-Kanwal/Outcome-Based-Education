/**
 * OTP login form component for OBE System
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import ErrorMessage from '../common/ErrorMessage';
import './OTPForm.css';

const OTPForm = ({ onSuccess, onSwitchToLogin }) => {
  const { requestOTP, verifyOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('request'); // 'request' or 'verify'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const result = await requestOTP(email);

    if (result.success) {
      setMessage(result.message || 'OTP sent to your email');
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

    const result = await verifyOTP(email, code);

    if (result.success) {
      onSuccess?.(result.user);
    } else {
      setError(result.error || 'Invalid OTP code');
    }

    setLoading(false);
  };

  return (
    <div className="otp-form">
      <h2>Login with OTP</h2>

      {step === 'request' ? (
        <form onSubmit={handleRequestOTP}>
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

          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            Send OTP
          </Button>

          <div className="auth-links">
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Back to Login
            </button>
          </div>
        </form>
      ) : (
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
            Verify OTP
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
              Request New OTP
            </button>
            <span>|</span>
            <button type="button" onClick={onSwitchToLogin} className="link-button">
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OTPForm;

