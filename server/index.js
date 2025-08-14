const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, 'database.sqlite');
let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('SQLite veritabanı bağlantı hatası:', err);
        reject(err);
        return;
      }
      console.log('SQLite veritabanına başarıyla bağlandı');
      
      // Create users table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'user',
          department TEXT DEFAULT '',
          phone TEXT DEFAULT '',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.run(createTableQuery, (err) => {
        if (err) {
          console.error('Tablo oluşturma hatası:', err);
          reject(err);
          return;
        }
        console.log('Users tablosu hazır');
        resolve();
      });
    });
  });
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token gerekli' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Geçersiz token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tüm alanlar gerekli' });
  }

  // Check if user already exists
  db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Sunucu hatası' });
    }

    if (row) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
    }

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Password hash error:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }

      // Insert new user
      db.run(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        function(err) {
          if (err) {
            console.error('Insert error:', err);
            return res.status(500).json({ message: 'Sunucu hatası' });
          }

          // Get user data (without password)
          db.get(
            'SELECT id, name, email, created_at FROM users WHERE id = ?',
            [this.lastID],
            (err, user) => {
              if (err) {
                console.error('Get user error:', err);
                return res.status(500).json({ message: 'Sunucu hatası' });
              }

              // Generate JWT token
              const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
              );

              res.status(201).json({
                success: true,
                message: 'Kullanıcı başarıyla oluşturuldu',
                user,
                token
              });
            }
          );
        }
      );
    });
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-posta ve şifre gerekli' });
  }

  // Find user
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Sunucu hatası' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
    }

    // Check password
    bcrypt.compare(password, user.password, (err, isValidPassword) => {
      if (err) {
        console.error('Password compare error:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }

      if (!isValidPassword) {
        return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Remove password from user object
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        message: 'Giriş başarılı',
        user: userWithoutPassword,
        token
      });
    });
  });
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [req.user.userId],
    (err, user) => {
      if (err) {
        console.error('Get profile error:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }

      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      res.json({
        success: true,
        user
      });
    }
  );
});

// Get all users (admin only)
app.get('/api/users', authenticateToken, (req, res) => {
  db.all(
    'SELECT id, name, email, role, department, phone, created_at, updated_at FROM users ORDER BY created_at DESC',
    (err, users) => {
      if (err) {
        console.error('Get users error:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }

      res.json({
        success: true,
        users
      });
    }
  );
});

// Create new user
app.post('/api/users', authenticateToken, async (req, res) => {
  const { name, email, password, role, department, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Ad, e-posta ve şifre gerekli' });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }

      if (row) {
        return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const insertQuery = `
        INSERT INTO users (name, email, password, role, department, phone, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `;

      db.run(insertQuery, [name, email, hashedPassword, role || 'user', department || '', phone || ''], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Sunucu hatası' });
        }

        // Get the created user
        db.get('SELECT id, name, email, role, department, phone, created_at, updated_at FROM users WHERE id = ?', [this.lastID], (err, user) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Sunucu hatası' });
          }
          res.status(201).json({ 
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: user
          });
        });
      });
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Update user
app.put('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, department, phone } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Ad ve e-posta gerekli' });
  }

  try {
    // Check if user exists
    db.get('SELECT id FROM users WHERE id = ?', [id], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }

      if (!row) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }

      // Check if email is already taken by another user
      db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, id], async (err, existingUser) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Sunucu hatası' });
        }

        if (existingUser) {
          return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanılıyor' });
        }

        let updateQuery = `
          UPDATE users 
          SET name = ?, email = ?, role = ?, department = ?, phone = ?, updated_at = datetime('now')
        `;
        let params = [name, email, role || 'user', department || '', phone || ''];

        // If password is provided, hash it and add to update
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateQuery = `
            UPDATE users 
            SET name = ?, email = ?, password = ?, role = ?, department = ?, phone = ?, updated_at = datetime('now')
          `;
          params = [name, email, hashedPassword, role || 'user', department || '', phone || ''];
        }

        updateQuery += ' WHERE id = ?';
        params.push(id);

        db.run(updateQuery, params, function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Sunucu hatası' });
          }

          // Get the updated user
          db.get('SELECT id, name, email, role, department, phone, created_at, updated_at FROM users WHERE id = ?', [id], (err, user) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ message: 'Sunucu hatası' });
            }
            res.json({ 
              success: true,
              message: 'Kullanıcı başarıyla güncellendi',
              user: user
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Delete user
app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // Check if user exists
  db.get('SELECT id FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Sunucu hatası' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // Delete user
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Sunucu hatası' });
      }
      res.json({ 
        success: true,
        message: 'Kullanıcı başarıyla silindi' 
      });
    });
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server çalışıyor' });
});

// Start server
const PORT = process.env.PORT || 5000;

function startServer() {
  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server ${PORT} portunda çalışıyor`);
        console.log(`Health check: http://localhost:${PORT}/api/health`);
      });
    })
    .catch((error) => {
      console.error('Server başlatma hatası:', error);
      process.exit(1);
    });
}

startServer();
