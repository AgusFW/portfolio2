import express from 'express';
import multer from 'multer';
import { 
    deleteEducation, 
    deleteWorkExperience, 
    getEducation, 
    getEducations, 
    getWorkExperience, 
    getWorkExperiences, 
    postEducation, 
    postWorkExperience, 
    putEducation, 
    putWorkExperience 
} from '../controllers/englishController.js';
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

//-------------------------------------------------------WORK EXPERIENCE--------------------------------------
//Obtener todas las experiencias
router.get('/workexperiences', getWorkExperiences);

//Crear una experiencia
router.post('/workexperience', upload.single('img'), postWorkExperience);


// Obtener una experiencia por ID
router.get('/workexperience/:id', getWorkExperience);

// Editar una experiencia existente
router.put('/workexperience/:id', upload.single('img'), putWorkExperience);

// Borrar una experiencia por ID
router.delete('/workexperience/:id', deleteWorkExperience);

//------------------------------------------------------- EDUCATION / COURSES ---------------------------
//Obtener todos los estudios
router.get('/educations', getEducations);

//Crear un estudio
router.post('/education', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), postEducation);

// Obtener un estudio por ID
router.get('/education/:id', getEducation);

// Editar un estudio existente
router.put('/education/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'certificado', maxCount: 1 }]), putEducation);

// Eliminar una experiencia por ID
router.delete('/education/:id', deleteEducation);

export default router;