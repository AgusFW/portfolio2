import express from 'express';
import pool from './config/db.js';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import españolRoutes from './router/español-routes.js';
import englishRoutes from './router/english-routes.js';

const app = express();
const port = 4000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieParser());

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar SECRET_KEY
const SECRET_KEY = process.env.SECRET_KEY;

// Función para verificar el token
function verifyToken(req, res, next) {
  const token = req.cookies.token;
  console.log("req.cookies", req.cookies)
  if (!token) {
    return res.status(403).send('Token requerido');
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("decoded", decoded)
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Token no válido');
  }
}

// Rutas para servir los archivos HTML
app.get('/espanol', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/english', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'english.html'));
});

//------------------------------------------------- Autenticación de usuarios--------------------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM login WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      connection.release();
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      connection.release();
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '2h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // Cambia a true si usas HTTPS
      maxAge: 2 * 60 * 60 * 1000 // 2 horas
    }).status(200).json({ message: 'Autenticación exitosa' });

    connection.release();
  } catch (error) {
    console.error('Error al autenticar al usuario', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logout exitoso' });
});


app.get('/is-authenticated', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

//------------------------------------------------- ESPAÑOL --------------------------------------
app.use('/', españolRoutes);

//------------------------------------------------- ENGLISH --------------------------------------
app.use('/', englishRoutes);

//-------------------------------------------------------PORT-------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
