import express from 'express';
import {
    createTenant,
    getTenants
} from '../controllers/tenantController.js';

const router = express.Router();

router.route('/tenants/createTenant').post(createTenant);
router.route('/tenants/getTenants').get(getTenants);

export default router;