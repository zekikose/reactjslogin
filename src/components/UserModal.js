import React, { useState, useEffect } from 'react';
import { X, UserPlus, User, Eye, EyeOff, Save, Loader } from 'lucide-react';
import axios from 'axios';
import './UserModal.css';

const UserModal = ({ isOpen, onClose, onUserAdded, editingUser = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    department: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || '',
        email: editingUser.email || '',
        password: '',
        confirmPassword: '',
        role: editingUser.role || 'user',
        department: editingUser.department || '',
        phone: editingUser.phone || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        department: '',
        phone: ''
      });
    }
    setError('');
    setSuccess('');
  }, [editingUser, isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Ad Soyad alanı zorunludur');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('E-posta alanı zorunludur');
      setLoading(false);
      return;
    }

    if (!editingUser && !formData.password) {
      setError('Şifre alanı zorunludur');
      setLoading(false);
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingUser) {
        // Update user
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          department: formData.department,
          phone: formData.phone
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        await axios.put(`http://localhost:5002/api/users/${editingUser.id}`, updateData, config);
        setSuccess('Kullanıcı başarıyla güncellendi');
      } else {
        // Create new user
        const response = await axios.post('http://localhost:5002/api/users', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department: formData.department,
          phone: formData.phone
        }, config);

        setSuccess('Kullanıcı başarıyla oluşturuldu');
        if (onUserAdded) {
          onUserAdded(response.data.user);
        }
      }

      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('User operation error:', err);
      setError(err.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-icon">
              {editingUser ? <User size={20} /> : <UserPlus size={20} />}
            </div>
            <h2>{editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Ad Soyad *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ad Soyad"
                required
                className="modal-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">E-posta *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ornek@sirket.com"
                required
                className="modal-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                {editingUser ? 'Yeni Şifre' : 'Şifre *'}
              </label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={editingUser ? 'Değiştirmek istemiyorsanız boş bırakın' : 'Şifre'}
                  required={!editingUser}
                  className="modal-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Şifre Tekrar</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifre tekrar"
                  className="modal-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Rol</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="modal-input"
              >
                <option value="user">Kullanıcı</option>
                <option value="admin">Yönetici</option>
                <option value="manager">Müdür</option>
                <option value="employee">Çalışan</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="department">Departman</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Departman"
                className="modal-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+90 555 123 45 67"
              className="modal-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              İptal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <Loader size={16} className="spinner" />
              ) : (
                <Save size={16} />
              )}
              <span>{editingUser ? 'Güncelle' : 'Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
