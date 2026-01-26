/**
 * Student Profile page
 * Allows students to view and edit their profile
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import Navbar from '../../components/common/Navbar';
import './Profile.css';

const Profile = () => {
  const { user: authUser } = useAuth();
  const { user: userProfile, updateProfile } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  useEffect(() => {
    if (userProfile || authUser) {
      const user = userProfile || authUser;
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    }
  }, [userProfile, authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const result = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const user = userProfile || authUser;
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const user = userProfile || authUser;
  const role = user?.role?.name || user?.role || 'Student';

  return (
    <>
      <Navbar />
      <div className="student-page profile-page">
        <div className="page-header">
          <h1>My Profile</h1>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>

      <div className="profile-content">
        <Card title="Profile Information">
          {error && <ErrorMessage message={error} />}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSave} className="profile-form">
            <Input
              label="First Name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
              disabled={!isEditing || saving}
            />

            <Input
              label="Last Name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
              disabled={!isEditing || saving}
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={true} // Email is typically not editable
            />

            <div className="profile-actions">
              {isEditing ? (
                <>
                  <Button type="submit" variant="primary" loading={saving} disabled={saving}>
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card title="Account Information">
          <div className="account-info">
            <p><strong>Role:</strong> {role}</p>
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Account Created:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Profile;

