import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import españolRoutes from './router/español-routes.js';
import englishRoutes from './router/english-routes.js';

const app = express();
const port = 4000;

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas para servir los archivos HTML
app.get('/espanol', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/english', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'english.html'));
});

// CRUD routes

//------------------------------------------------- Autenticación de usuarios--------------------------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM usuariosDB WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Autenticación exitosa' });

    connection.release();
  } catch (error) {
    console.error('Error al autenticar al usuario', error);
    res.status(500).json({ message: 'Error interno del servidor' });
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
