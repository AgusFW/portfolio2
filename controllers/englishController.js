import pool from '../config/db.js';

//-------------------------------------------------------WORK EXPERIENCE--------------------------------
// /workexperiences
export const getWorkExperiences = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM work_experience');

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

// /workexperience
export const postWorkExperience = async (req, res) => {
    try {
        const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube } = req.body;
        const img = req.file ? req.file.filename : null;
        if (!periodo || !titulo || !descripcion) {
            return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
        }
        
        const [result] = await pool.query('INSERT INTO work_experience SET ?', {
                titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img
        });

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

// /workexperience/:id
export const getWorkExperience = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT * FROM work_experience WHERE _id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Experiencia no encontrada' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error connecting to database', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// /workexperience/:id
export const putWorkExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, periodo, descripcion, modalidad, url, lenguajes, githube } = req.body;
        let img = req.body.img;
        if (req.file) {
            img = req.file.filename; 
        } else {
            const [currentImage] = await pool.query(
                'SELECT img FROM work_experience WHERE _id = ?',
                [id]
            );

            if (currentImage.length > 0) {
                img = currentImage[0].img;
            }
        }
        if (!titulo || !periodo || !descripcion) {
            return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
        }

        const [result] = await pool.query(
            'UPDATE work_experience SET titulo = ?, periodo = ?, descripcion = ?, modalidad = ?, url = ?, lenguajes = ?, githube = ?, img = ? WHERE _id = ?',
            [titulo, periodo, descripcion, modalidad, url, lenguajes, githube, img, id]
        );

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

// /workexperience/:id
export const deleteWorkExperience = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM work_experience WHERE _id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Experiencia no encontrada' });
        }

        res.json({ message: 'Experiencia eliminada correctamente' });
    } catch (err) {
        console.error('Error connecting to database', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

//------------------------------------------------------- EDUCATION / COURSES ---------------------------
// /educations
export const getEducations = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM education');

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

// /education
export const postEducation = async (req, res) => {
    try {
        const { titulo, periodo, descripcion, lenguajes } = req.body;
        const img = req.files['img'] ? req.files['img'][0].filename : null;
        const certificado = req.files['certificado'] ? req.files['certificado'][0].filename : null;

        if (!periodo || !titulo || !descripcion) {
            return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
        }
        const [result] = await pool.query('INSERT INTO education SET ?', {
            titulo, periodo, descripcion, lenguajes, img, certificado
        });
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

// /education/:id
export const getEducation = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query('SELECT * FROM education WHERE _id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Estudio no encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error('Error connecting to database', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// /education/:id
export const putEducation = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, periodo, descripcion, lenguajes } = req.body;
        let img = null;
        let certificado = null;

        if (req.files['img'] && req.files['img'].length > 0) {
            img = req.files['img'][0].filename;
        } else {
            const [currentImg] = await pool.query(
                'SELECT img FROM education WHERE _id = ?',
                [id]
            );

            if (currentImg.length > 0) {
                img = currentImg[0].img;
            }
        }

        if (req.files['certificado'] && req.files['certificado'].length > 0) {
            certificado = req.files['certificado'][0].filename;
        } else {
            const [currentCertificado] = await pool.query(
                'SELECT certificado FROM education WHERE _id = ?',
                [id]
            );

            if (currentCertificado.length > 0) {
                certificado = currentCertificado[0].certificado;
            }
        }

        if (!titulo || !periodo || !descripcion) {
            return res.status(400).json({ message: 'Los campos titulo, periodo y descripcion son requeridos' });
        }

        const [result] = await pool.query(
            'UPDATE education SET titulo = ?, periodo = ?, descripcion = ?, lenguajes = ?, img = ?, certificado = ? WHERE _id = ?',
            [titulo, periodo, descripcion, lenguajes, img, certificado, id]
        );

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

// /education/:id
export const deleteEducation = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query('DELETE FROM education WHERE _id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Estudio no encontrado' });
        }

        res.status(200).json({ message: 'Estudio eliminado correctamente' });
    } catch (err) {
        console.error('Error connecting to database', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
