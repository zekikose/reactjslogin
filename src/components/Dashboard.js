import React, { useState, useEffect } from 'react';
import { 
  Home, 
  User, 
  Settings, 
  FileText, 
  BarChart3, 
  LogOut, 
  Menu, 
  X,
  Users,
  Calendar,
  MessageSquare,
  Bell,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import axios from 'axios';
import UserModal from './UserModal';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const menuItems = [
    { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'reports', label: 'Raporlar', icon: FileText },
    { id: 'analytics', label: 'Analitik', icon: BarChart3 },
    { id: 'calendar', label: 'Takvim', icon: Calendar },
    { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'settings', label: 'Ayarlar', icon: Settings },
  ];

  // Fetch users when users page is active
  useEffect(() => {
    if (activeMenu === 'users') {
      fetchUsers();
    }
  }, [activeMenu]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5002/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleUserAdded = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="dashboard-content">
            <h2>Hoş Geldiniz, {user?.name}!</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>Toplam Kullanıcı</h3>
                  <p>1,234</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <h3>Toplam Rapor</h3>
                  <p>567</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-info">
                  <h3>Aylık Ziyaret</h3>
                  <p>89,123</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-info">
                  <h3>Yeni Mesaj</h3>
                  <p>23</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <div className="profile-info">
                <h3>Sistem Durumu</h3>
                <p>Merhaba {user?.name}, sisteminize hoş geldiniz</p>
                <p>Son giriş: {new Date().toLocaleDateString('tr-TR')}</p>
                <p>Durum: Aktif</p>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="dashboard-content">
            <h2>Profil Bilgileri</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <User size={24} />
                </div>
                <div className="stat-info">
                  <h3>Profil Durumu</h3>
                  <p>Aktif</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Üyelik Tarihi</h3>
                  <p>{new Date().toLocaleDateString('tr-TR')}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Settings size={24} />
                </div>
                <div className="stat-info">
                  <h3>Hesap Türü</h3>
                  <p>Standart</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <div className="profile-info">
                <h3>{user?.name}</h3>
                <p>E-posta: {user?.email}</p>
                <p>Üye olma tarihi: {new Date().toLocaleDateString('tr-TR')}</p>
                <p>Son giriş: {new Date().toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
          </div>
        );
            case 'users':
        return (
          <div className="dashboard-content">
            <h2>Kullanıcı Yönetimi</h2>
            
            {/* Header with Add Button */}
            <div className="users-header">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Kullanıcı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={handleAddUser} className="add-user-btn">
                <Plus size={20} />
                <span>Yeni Kullanıcı</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Kullanıcılar yükleniyor...</p>
                </div>
              ) : (
                <div className="users-table">
                  <div className="table-header">
                    <div className="table-cell">Ad Soyad</div>
                    <div className="table-cell">E-posta</div>
                    <div className="table-cell">Rol</div>
                    <div className="table-cell">Departman</div>
                    <div className="table-cell">Kayıt Tarihi</div>
                    <div className="table-cell">İşlemler</div>
                  </div>
                  
                  {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                      <Users size={48} />
                      <h3>Kullanıcı bulunamadı</h3>
                      <p>Henüz kullanıcı eklenmemiş veya arama sonucu bulunamadı.</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="table-row">
                        <div className="table-cell">
                          <div className="user-info-cell">
                            <div className="user-avatar">
                              <User size={16} />
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </div>
                        <div className="table-cell">{user.email}</div>
                        <div className="table-cell">
                          <span className={`role-badge role-${user.role || 'user'}`}>
                            {user.role || 'Kullanıcı'}
                          </span>
                        </div>
                        <div className="table-cell">{user.department || '-'}</div>
                        <div className="table-cell">
                          {new Date(user.created_at).toLocaleDateString('tr-TR')}
                        </div>
                        <div className="table-cell">
                          <div className="action-buttons">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="action-btn edit-btn"
                              title="Düzenle"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              title="Sil"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User Modal */}
            <UserModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditingUser(null);
              }}
              onUserAdded={handleUserAdded}
              editingUser={editingUser}
            />
          </div>
        );
      case 'reports':
        return (
          <div className="dashboard-content">
            <h2>Raporlar</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-info">
                  <h3>Toplam Rapor</h3>
                  <p>567</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-info">
                  <h3>Aylık Rapor</h3>
                  <p>45</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Bu Hafta</h3>
                  <p>12</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <FileText size={48} />
              </div>
                              <div className="profile-info">
                  <h3>Rapor İstatistikleri</h3>
                  <p>Toplam Rapor: 567</p>
                  <p>Bu Ay: 45</p>
                  <p>Bu Hafta: 12</p>
                </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="dashboard-content">
            <h2>Analitik</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={24} />
                </div>
                <div className="stat-info">
                  <h3>Ziyaretçi</h3>
                  <p>89,123</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h3>Dönüşüm</h3>
                  <p>23.4%</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-info">
                  <h3>Etkileşim</h3>
                  <p>67.8%</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <BarChart3 size={48} />
              </div>
                              <div className="profile-info">
                  <h3>Analitik Özeti</h3>
                  <p>Ziyaretçi: 89,123</p>
                  <p>Dönüşüm: 23.4%</p>
                  <p>Etkileşim: 67.8%</p>
                </div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="dashboard-content">
            <h2>Takvim</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Bugün</h3>
                  <p>5</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Bu Hafta</h3>
                  <p>23</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={24} />
                </div>
                <div className="stat-info">
                  <h3>Bu Ay</h3>
                  <p>89</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <Calendar size={48} />
              </div>
                              <div className="profile-info">
                  <h3>Takvim Özeti</h3>
                  <p>Bugün: 5 Etkinlik</p>
                  <p>Bu Hafta: 23 Etkinlik</p>
                  <p>Bu Ay: 89 Etkinlik</p>
                </div>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="dashboard-content">
            <h2>Mesajlar</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-info">
                  <h3>Toplam Mesaj</h3>
                  <p>1,567</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-info">
                  <h3>Okunmamış</h3>
                  <p>23</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="stat-info">
                  <h3>Yanıtlanan</h3>
                  <p>1,544</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <MessageSquare size={48} />
              </div>
                              <div className="profile-info">
                  <h3>Mesaj İstatistikleri</h3>
                  <p>Toplam: 1,567 Mesaj</p>
                  <p>Okunmamış: 23</p>
                  <p>Yanıtlanan: 1,544</p>
                </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="dashboard-content">
            <h2>Bildirimler</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Bell size={24} />
                </div>
                <div className="stat-info">
                  <h3>Toplam Bildirim</h3>
                  <p>234</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Bell size={24} />
                </div>
                <div className="stat-info">
                  <h3>Okunmamış</h3>
                  <p>12</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Bell size={24} />
                </div>
                <div className="stat-info">
                  <h3>Bugün</h3>
                  <p>8</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <Bell size={48} />
              </div>
                              <div className="profile-info">
                  <h3>Bildirim İstatistikleri</h3>
                  <p>Toplam: 234 Bildirim</p>
                  <p>Okunmamış: 12</p>
                  <p>Bugün: 8</p>
                </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="dashboard-content">
            <h2>Ayarlar</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Settings size={24} />
                </div>
                <div className="stat-info">
                  <h3>Genel Ayarlar</h3>
                  <p>Aktif</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Settings size={24} />
                </div>
                <div className="stat-info">
                  <h3>Güvenlik</h3>
                  <p>Aktif</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <Settings size={24} />
                </div>
                <div className="stat-info">
                  <h3>Bildirimler</h3>
                  <p>Aktif</p>
                </div>
              </div>
            </div>
            <div className="profile-card">
              <div className="profile-avatar">
                <Settings size={48} />
              </div>
                              <div className="profile-info">
                  <h3>Sistem Durumu</h3>
                  <p>Genel: Aktif</p>
                  <p>Güvenlik: Aktif</p>
                  <p>Bildirimler: Aktif</p>
                </div>
            </div>
          </div>
        );
      default:
        return <div>Sayfa bulunamadı</div>;
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
          <button 
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveMenu(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={onLogout}>
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="header-content">
            <h1>{menuItems.find(item => item.id === activeMenu)?.label}</h1>
            <div className="user-info">
              <span>Merhaba, {user?.name}</span>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          {renderContent()}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
