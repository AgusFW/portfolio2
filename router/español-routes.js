import express from 'express';
import multer from 'multer';
import { 
    deleteEstudio, 
    deleteExperiencia, 
    getCoverLetter, 
    getEstudio, 
    getEstudios, 
    getExperiencia, 
    getExperiencias, 
    getPerfil, 
    getPerfiles, 
    postCoverLetter, 
    postEstudio, 
    postExperiencia, 
    postPerfil, 
    putCoverLetter, 
    putEstudio, 
    putExperiencia, 
    putPerfil 
} from '../controllers/españolController.js';
const router = express.Router();

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

//-------------------------------------------------------PERFIL-----------------------------------------
//Obtener todos los perfiles
router.get('/perfiles', getPerfiles);

//Crear un perfil
router.post('/perfil', postPerfil);

// Obtener un perfil por ID
router.get('/perfil/:id', getPerfil);

// Editar un perfil existente
router.put('/perfil/:id', putPerfil);

//-------------------------------------------------------EXPERIENCIA LABORAL----------------------------
//Obtener todas las experiencia
router.get('/experiencias', getExperiencias);

//Crear una experiencia
router.post('/experiencia', upload.single('img'), postExperiencia);


// Obtener una experiencia por ID
router.get('/experiencia/:id', getExperiencia);

// Editar una experiencia existente
router.put('/experiencia/:id', upload.single('img'), putExperiencia);

// Borrar una experiencia por ID
router.delete('/experiencia/:id', deleteExperiencia);

//-------------------------------------------------------ESTUDIOS / CURSOS -----------------------------
//Obtener todos los estudios
router.get('/estudios', getEstudios);

// Crear un estudio
router.post('/estudio', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), postEstudio);

// Obtener un estudio por ID
router.get('/estudio/:id', getEstudio);

// Editar un estudio existente
router.put('/estudio/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), putEstudio);

// Eliminar un estudio por ID
router.delete('/estudio/:id', deleteEstudio);

//-------------------------------------------------------COVER LETTER------------------------------------
// Obtener un cover letter por ID
router.get('/coverLetter/:id', getCoverLetter);

//Crear una Cover Letter
router.post('/coverLetter', postCoverLetter);

// Editar una cover letter existente
router.put('/coverLetter/:id', putCoverLetter);

export default router;