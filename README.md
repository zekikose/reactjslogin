# 🚀 React.js Login Dashboard

Modern React.js ile geliştirilmiş, SQLite veritabanı kullanan profesyonel giriş ekranı ve dashboard uygulaması.

## ✨ Özellikler

### 🔐 Kimlik Doğrulama
- JWT token tabanlı güvenlik
- Şifre hashleme (bcrypt)
- Oturum yönetimi
- Güvenli API endpoint'leri

### 🎨 Modern UI/UX
- Responsive tasarım
- Profesyonel business teması
- Modern CSS animasyonları
- Glassmorphism efektleri
- Lucide React ikonları

### 👥 Kullanıcı Yönetimi
- Kullanıcı kayıt/giriş
- Popup modal ile kullanıcı ekleme
- Kullanıcı düzenleme/silme
- Rol tabanlı yetkilendirme
- Arama ve filtreleme

### 📊 Dashboard
- Ana sayfa istatistikleri
- Kullanıcı yönetimi
- Raporlar ve analitik
- Takvim entegrasyonu
- Mesajlar ve bildirimler
- Ayarlar sayfası

## 🛠️ Teknolojiler

### Frontend
- **React.js** - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **CSS3** - Styling ve animasyonlar

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - File-based database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Repository'yi klonlayın:**
```bash
git clone https://github.com/kullaniciadi/reactjslogin.git
cd reactjslogin
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Environment dosyasını oluşturun:**
```bash
cp .env.example .env
```

4. **Environment değişkenlerini düzenleyin:**
```env
PORT=5002
JWT_SECRET=your-secret-key-here
```

5. **Backend'i başlatın:**
```bash
node server/index.js
```

6. **Frontend'i başlatın (yeni terminal):**
```bash
npm start
```

7. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 🔧 API Endpoint'leri

### Kimlik Doğrulama
- `POST /api/auth/register` - Kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/user/profile` - Kullanıcı profili

### Kullanıcı Yönetimi
- `GET /api/users` - Tüm kullanıcıları listele
- `POST /api/users` - Yeni kullanıcı oluştur
- `PUT /api/users/:id` - Kullanıcı güncelle
- `DELETE /api/users/:id` - Kullanıcı sil

### Sistem
- `GET /api/health` - Sunucu durumu

## 👤 Test Kullanıcıları

Uygulama ilk çalıştırıldığında aşağıdaki test kullanıcıları otomatik oluşturulur:

| E-posta | Şifre | Rol |
|---------|-------|-----|
| `test@example.com` | `123456` | Kullanıcı |
| `admin@test.com` | `admin123` | Yönetici |
| `business@test.com` | `business123` | Müdür |

## 📁 Proje Yapısı

```
reactjslogin/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Dashboard.js
│   │   ├── Dashboard.css
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── UserModal.js
│   │   └── UserModal.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── server/
│   ├── index.js
│   └── database.sqlite (otomatik oluşturulur)
├── package.json
├── .env
├── .gitignore
└── README.md
```

## 🎯 Kullanım

### Giriş Yapma
1. Ana sayfada "Giriş Yap" butonuna tıklayın
2. E-posta ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

### Kullanıcı Ekleme
1. Dashboard'da "Kullanıcılar" menüsüne tıklayın
2. "Yeni Kullanıcı" butonuna tıklayın
3. Form alanlarını doldurun
4. "Kaydet" butonuna tıklayın

### Kullanıcı Düzenleme
1. Kullanıcı listesinde düzenleme ikonuna tıklayın
2. Form alanlarını güncelleyin
3. "Güncelle" butonuna tıklayın

## 🔒 Güvenlik

- JWT token tabanlı kimlik doğrulama
- bcrypt ile şifre hashleme
- SQL injection koruması
- Input validation
- CORS yapılandırması

## 🚀 Deployment

### Vercel (Frontend)
```bash
npm run build
vercel --prod
```

### Heroku (Backend)
```bash
heroku create
git push heroku main
```

### Railway (Full Stack)
```bash
railway login
railway init
railway up
```

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

**Zeki Köse**
- E-posta: zizitr@gmail.com
- GitHub: [@zekikose](https://github.com/zekikose)

## 🙏 Teşekkürler

- [React.js](https://reactjs.org/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [Lucide React](https://lucide.dev/)
- [Tailwind CSS](https://tailwindcss.com/) (inspiration)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
