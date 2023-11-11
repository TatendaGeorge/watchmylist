import express from 'express';
import { 
    getAllPatients,
    createPatient,
    getPatientById,
    updatePatient,
    deletePatient,
} from '../controllers/patientController.js';
import patientModelMiddleware from '../middlewares/patientModelMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/patients/createPatient').post(authMiddleware, patientModelMiddleware, createPatient);
router.route('/patients/getAllPatients').get(authMiddleware, patientModelMiddleware, getAllPatients);
router.route('/:tenantId/patient/:id/getPatientById').get(patientModelMiddleware, getPatientById);
router.route('/:tenantId/patient/:id/updatePatient').put(patientModelMiddleware, updatePatient);
router.route('/:tenantId/patient/:id/deletePatient').put(patientModelMiddleware, deletePatient);

export default router;
