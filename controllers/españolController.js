import pool from '../config/db.js';

//-------------------------------------------------------PERFIL-----------------------------------------
// /perfiles

export const getPerfiles = async (req, res) => {
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
};

// /perfil
export const postPerfil = async (req, res) => {
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
};

// /perfil/:id
export const getPerfil = async (req, res) => {
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
};

// /perfil/:id
export const putPerfil = async (req, res) => {
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
};

//-------------------------------------------------------EXPERIENCIA LABORAL----------------------------
// /experiencias
export const getExperiencias = async (req, res) => {
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
};

// /experiencia
export const postExperiencia = async (req, res) => {
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
};

// /experiencia/:id
export const getExperiencia = async (req, res) => {
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
};

// /experiencia/:id
export const putExperiencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube } = req.body;
        let img = req.body.img;
        if (req.file) {
            img = req.file.filename; 
        } else {
            const connection = await pool.getConnection();
            const [currentImage] = await connection.query(
                'SELECT img FROM experiencia WHERE _id = ?',
                [id]
            );
            connection.release();
            if (currentImage.length > 0) {
                img = currentImage[0].img;
            }
        }
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
};

// /experiencia/:id
export const deleteExperiencia = async (req, res) => {
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
};

//-------------------------------------------------------ESTUDIOS / CURSOS -----------------------------
// /estudios
export const getEstudios = async (req, res) => {
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
};

// /estudio
export const postEstudio = async (req, res) => {
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
};

// /estudio/:id
export const getEstudio = async (req, res) => {
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
};

// /estudio/:id
export const putEstudio = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, periodo, descripcion, lenguajes } = req.body;
        let img = null;
        let certificado = null;

        if (req.files['img'] && req.files['img'].length > 0) {
            img = req.files['img'][0].filename;
        } else {
            const connection = await pool.getConnection();
            const [currentImg] = await connection.query(
                'SELECT img FROM estudios WHERE _id = ?',
                [id]
            );
            connection.release();

            if (currentImg.length > 0) {
                img = currentImg[0].img;
            }
        }

        if (req.files['certificado'] && req.files['certificado'].length > 0) {
            certificado = req.files['certificado'][0].filename;
        } else {
            const connection = await pool.getConnection();
            const [currentCertificado] = await connection.query(
                'SELECT certificado FROM estudios WHERE _id = ?',
                [id]
            );
            connection.release();

            if (currentCertificado.length > 0) {
                certificado = currentCertificado[0].certificado;
            }
        }

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
};

// /estudio/:id
export const deleteEstudio = async (req, res) => {
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
};

//-------------------------------------------------------COVER LETTER------------------------------------
// /coverLetter/:id
export const getCoverLetter = async (req, res) => {
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
};

// /coverLetter
export const postCoverLetter = async (req, res) => {
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
};

// /coverLetter/:id
export const putCoverLetter = async (req, res) => {
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
};