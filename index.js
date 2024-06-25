import express from 'express';
import pool from './config/db.js';

const app = express();
const port = 4000;

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

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

//-------------------------------------------------------PERFIL-----------------------------------------
//Obtener todos los perfiles
app.get('/perfiles', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM sobre_mi');
    connection.release();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No profiles found' });
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

//Crear un perfil
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

//-------------------------------------------------------EXPERIENCIA LABORAL-----------------------------------------
//Obtener todas las experiencia
app.get('/experiencias', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM experiencia');
    connection.release();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No profiles found' });
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

//Crear una experiencia
app.post('/experiencia', async (req, res) => {
  try {
    const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img } = req.body;
    if (!periodo || !titulo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO experiencia SET ?', [
      req.body
    ]);
    connection.release();
    res.json({ id: result.insertId, titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});


// Obtener una experiencia por ID
app.get('/experiencia/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM experiencia WHERE _id = ?', [id]);
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

// Editar una experiencia existente
app.put('/experiencia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img } = req.body;

    if (!titulo || !periodo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE experiencia SET titulo = ?, periodo = ?, descripcion = ?, modalidad = ?, url = ?, lenguajes = ?, githube = ?, img = ? WHERE _id = ?',
      [titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil actualizado correctamente', id, titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Borrar una experiencia por ID
app.delete('/experiencia/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM experiencia WHERE _id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }

    res.json({ message: 'Experiencia eliminada correctamente' });
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//-------------------------------------------------------ESTUDIOS / CURSOS -----------------------------------------
//Obtener todos los estudios
app.get('/estudios', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM estudios');
    connection.release();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No profiles found' });
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

//Crear un estudio
app.post('/estudio', async (req, res) => {
  try {
    const { titulo, periodo, descripcion, lenguajes, img, certificado } = req.body;
    if (!periodo || !titulo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO estudios SET ?', [
      req.body
    ]);
    connection.release();
    res.json({ id: result.insertId, titulo, periodo, descripcion, lenguajes, img, certificado });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Obtener un estudio por ID
app.get('/estudio/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM estudios WHERE _id = ?', [id]);
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

// Editar un estudio existente
app.put('/estudio/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, periodo, descripcion, lenguajes, img, certificado } = req.body;

    if (!titulo || !periodo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE estudios SET titulo = ?, periodo = ?, descripcion = ?, lenguajes = ?, img = ?, certificado = ? WHERE _id = ?',
      [titulo, periodo, descripcion, lenguajes, img, certificado, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    res.json({ message: 'Perfil actualizado correctamente', id, titulo, periodo, descripcion, lenguajes, img, certificado });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Eliminar una experiencia por ID
app.delete('/estudio/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM estudios WHERE _id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.status(200).json({ message: 'Estudio eliminado correctamente' });
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//-------------------------------------------------------PORT-------------------------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
