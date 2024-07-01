import express from 'express';
import pool from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();
const port = 4000;

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

// Middleware para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //console.log("multer file", file)
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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
      res.status(404).json({ message: 'No se encontraron las experiencias.' });
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

//Crear una experiencia
app.post('/experiencia', upload.single('img'), async (req, res) => {
  try {
    const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube } = req.body;
    const img = req.file ? req.file.filename : null;

    //console.log('Archivo subido:', req.file);

    if (!periodo || !titulo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO experiencia SET ?', {
      titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img
    });
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
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Editar una experiencia existente
app.put('/experiencia/:id', upload.single('img'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube } = req.body;
    const img = req.file ? req.file.filename : req.body.img;

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
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }

    res.json({ message: 'Experiencia actualizada correctamente', id, titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img });
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
      res.status(404).json({ message: 'No se encontraron los estudios' });
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

// Crear un estudio
app.post('/estudio', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), async (req, res) => {
  try {
    const { titulo, periodo, descripcion, lenguajes } = req.body;
    const img = req.files['img'] ? req.files['img'][0].filename : null;
    const certificado = req.files['certificado'] ? req.files['certificado'][0].filename : null;

    if (!periodo || !titulo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO estudios SET ?', {
      titulo, periodo, descripcion, lenguajes, img, certificado
    });
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
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Editar un estudio existente
app.put('/estudio/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, periodo, descripcion, lenguajes } = req.body;
    const img = req.files['img'] ? req.files['img'][0].filename : null;
    const certificado = req.files['certificado'] ? req.files['certificado'][0].filename : null;

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
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json({ message: 'Estudio actualizado correctamente', id, titulo, periodo, descripcion, lenguajes, img, certificado });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Eliminar un estudio por ID
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

//-------------------------------------------------------COVER LETTER----------------------------------------------------
// Obtener un cover letter por ID
app.get('/coverLetter/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM cover_letter WHERE _id = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cover Letter no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

//Crear una Cover Letter
app.post('/coverLetter', async (req, res) => {
  try {
    const { carta } = req.body;
    if (!carta) {
      return res.status(400).json({ message: 'El campo carta es obligatorio' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO cover_letter SET ?', [
      req.body
    ]);
    connection.release();
    res.json({ id: result.insertId, carta });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

// Editar una cover letter existente
app.put('/coverLetter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { carta } = req.body;

    if (!carta) {
      return res.status(400).json({ message: 'El campo carta es obligatorio.' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE cover_letter SET carta = ? WHERE _id = ?',
      [carta, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cover letter no encontrada.' });
    }

    res.json({ message: 'Cover Letter actualizada correctamente.', id, carta });
  } catch (err) {
    if (err.code === 'ER_BAD_FIELD_ERROR') {
      res.status(400).json({ message: 'Error en los campos enviados' });
    } else {
      console.error('Error connecting to database', err);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
});

//-------------------------------------------------------WORK EXPERIENCE-----------------------------------------
//Obtener todas las experiencias
app.get('/workexperiences', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM work_experience');
    connection.release();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No se encontraron las experiencias.' });
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

//Crear una experiencia
app.post('/workexperience', upload.single('img'), async (req, res) => {
  try {
    const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube } = req.body;
    const img = req.file ? req.file.filename : null;
    if (!periodo || !titulo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO work_experience SET ?', {
      titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img
    });
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
app.get('/workexperience/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM work_experience WHERE _id = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Editar una experiencia existente
app.put('/workexperience/:id', upload.single('img'), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube } = req.body;
    const img = req.file ? req.file.filename : req.body.img;

    if (!titulo || !periodo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE work_experience SET titulo = ?, periodo = ?, descripcion = ?, modalidad = ?, url = ?, lenguajes = ?, githube = ?, img = ? WHERE _id = ?',
      [titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Experiencia no encontrada' });
    }

    res.json({ message: 'Experiencia actualizada correctamente', id, titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img });
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
app.delete('/workexperience/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM work_experience WHERE _id = ?', [id]);
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

//------------------------------------------------------- EDUCATION / COURSES -----------------------------------------
//Obtener todos los estudios
app.get('/educations', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM education');
    connection.release();

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No se encontraron los estudios' });
    }
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).send('Internal server error');
  }
});

//Crear un estudio
app.post('/education', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), async (req, res) => {
  try {
    const { titulo, periodo, descripcion, lenguajes } = req.body;
    const img = req.files['img'] ? req.files['img'][0].filename : null;
    const certificado = req.files['certificado'] ? req.files['certificado'][0].filename : null;

    if (!periodo || !titulo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }
    const connection = await pool.getConnection();
    const [result] = await connection.query('INSERT INTO education SET ?', {
      titulo, periodo, descripcion, lenguajes, img, certificado
    });
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
app.get('/education/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM education WHERE _id = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error connecting to database', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Editar un estudio existente
app.put('/education/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, periodo, descripcion, lenguajes } = req.body;
    const img = req.files['img'] ? req.files['img'][0].filename : null;
    const certificado = req.files['certificado'] ? req.files['certificado'][0].filename : null;

    if (!titulo || !periodo || !descripcion) {
      return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'UPDATE education SET titulo = ?, periodo = ?, descripcion = ?, lenguajes = ?, img = ?, certificado = ? WHERE _id = ?',
      [titulo, periodo, descripcion, lenguajes, img, certificado, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Estudio no encontrado' });
    }

    res.json({ message: 'Estudio actualizado correctamente', id, titulo, periodo, descripcion, lenguajes, img, certificado });
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
app.delete('/education/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM education WHERE _id = ?', [id]);
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
