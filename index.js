import express from 'express';
import pool from './config/db.js';

const app = express();
const port = 4000;

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

// CRUD routes

// Autenticación de usuarios
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

//Obtener todo el perfil
app.get('/perfil', async(req, res) => {
  try {
    let query = req.query;
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM sobre_mi');
    connection.release();

    let filtrados = rows.filter((registro) => registro.rol === query.rol ); 
    if (filtrados.length > 0) {
        res.json(filtrados); 
    } else {
        res.json(rows[0]);
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

//Crear el perfil
app.post('/perfil', async (req, res) => {
  try {
    const { nombre, titulo, perfil, skills } = req.body;
    if (!nombre || !titulo || !perfil || !skills) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO sobre_mi SET ?', [
      req.body
    ]);
    connection.release();
    res.json({ id: result.insertId, nombre, titulo, perfil, skills });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Obtener un perfil por ID
app.get('/perfil/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM sobre_mi WHERE _id = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Editar un perfil existente
app.put('/perfil/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, titulo, perfil, skills } = req.body;

    if (!nombre || !titulo || !perfil || !skills) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE sobre_mi SET nombre = ?, titulo = ?, perfil = ?, skills = ? WHERE _id = ?',
      [nombre, titulo, perfil, skills, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil actualizado correctamente', id, nombre, titulo, perfil, skills });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
