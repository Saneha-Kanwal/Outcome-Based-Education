/**
 * Registration page for OBE System
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSuccess = (user) => {
    // Redirect based on role
    const role = user.role?.name || user.role;
    if (role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (role === 'Teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <RegisterForm
          onSuccess={handleSuccess}
          onSwitchToLogin={() => navigate('/login')}
        />
      </div>
    </div>
  );
};

export default Register;

