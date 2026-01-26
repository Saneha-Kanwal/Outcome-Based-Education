/**
 * Edit User page for Admin
 * Allows admins to edit user information
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Navbar from '../../components/common/Navbar';
import './Users.css';

const EditUser = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role_id: 3,
    is_active: true
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/users/${id}`);
      const userData = response.data;
      
      setUser(userData);
      setFormData({
        email: userData.email || '',
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        role_id: userData.role?.id || userData.role_id || 3,
        is_active: userData.is_active !== undefined ? userData.is_active : true
      });
    } catch (err) {
      console.error('Error fetching user:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to load user';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'role_id' ? parseInt(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!formData.email.trim()) {
        setError('Email is required.');
        return;
      }

      if (!formData.first_name.trim() || !formData.last_name.trim()) {
        setError('First and last name are required.');
        return;
      }

      const payload = {
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role_id: formData.role_id,
        is_active: formData.is_active
      };

      await api.put(`/users/${id}`, payload);
      navigate('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to update user';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-page">
          <Loading message="Loading user..." />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="admin-page">
          <ErrorMessage message="User not found" />
          <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-page users-page">
        <div className="page-header">
          <h1>Edit User</h1>
          <div className="page-actions">
            <Button onClick={() => navigate('/admin/users')}>Back to Users</Button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Card title={`Edit User: ${user.first_name} ${user.last_name}`} className="edit-user-form">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={saving}
              />
              <div className="input-group">
                <label>Status</label>
                <div style={{ padding: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <Input
                label="First Name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                required
                disabled={saving}
              />
              <Input
                label="Last Name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                required
                disabled={saving}
              />
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Role</label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="input"
                >
                  <option value={1}>Admin</option>
                  <option value={2}>Teacher</option>
                  <option value={3}>Student</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" loading={saving} disabled={saving}>
                Save Changes
              </Button>
              <Button type="button" onClick={() => navigate('/admin/users')} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default EditUser;

