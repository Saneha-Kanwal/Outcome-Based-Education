/**
 * Admin Users Management page
 * Allows admins to view, create, update, and delete users
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Navbar from '../../components/common/Navbar';
import './Users.css';

const Users = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role_id: 3, // Default to Student
    is_active: true
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/users');
      console.log('Users API response:', response);
      
      let usersData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.data.users && Array.isArray(response.data.users)) {
          usersData = response.data.users;
        } else if (response.data.items && Array.isArray(response.data.items)) {
          usersData = response.data.items;
        }
      }
      
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to load users';
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      if (formData.password && formData.password.length < 8) {
        setError('Password must be at least 8 characters long. You can also leave it blank to send an activation email later.');
        return;
      }

      const payload = {
        email: formData.email.trim(),
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role_id: formData.role_id,
        password: formData.password?.trim() || undefined
      };

      await api.post('/users', payload);
      setShowCreateForm(false);
      setFormData({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role_id: 3,
        is_active: true
      });
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error creating user:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to create user';
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error('Error deleting user:', err);
      alert(err.response?.data?.detail || err.response?.data?.error || 'Failed to delete user');
    }
  };

  const getRoleName = (roleId) => {
    const roleMap = { 1: 'Admin', 2: 'Teacher', 3: 'Student' };
    return roleMap[roleId] || 'Unknown';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="admin-page">
          <Loading message="Loading users..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admin-page users-page">
        <div className="page-header">
          <h1>User Management</h1>
          <div className="page-actions">
            <Button onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</Button>
            <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'Cancel' : 'Create New User'}
            </Button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        {showCreateForm && (
          <Card title="Create New User" className="create-user-form">
            <form onSubmit={handleCreateUser}>
              <div className="form-row">
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={creating}
                />
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={creating}
                />
              </div>
              <div className="form-row">
                <Input
                  label="First Name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  disabled={creating}
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  disabled={creating}
                />
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Role</label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    disabled={creating}
                    className="input"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Teacher</option>
                    <option value={3}>Student</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      disabled={creating}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="form-actions">
                <Button type="submit" variant="primary" loading={creating} disabled={creating}>
                  Create User
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="users-content">
          {users.length === 0 ? (
            <Card>
              <p>No users found.</p>
            </Card>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.first_name} {user.last_name}</td>
                      <td>{user.email}</td>
                      <td>{user.role?.name || getRoleName(user.role_id || user.role?.id)}</td>
                      <td>
                        <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/admin/users/${user.id}`)}
                            style={{ marginRight: '0.5rem' }}
                          >
                            Edit
                          </Button>
                          {user.id !== currentUser?.id && (
                            <Button
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Users;

