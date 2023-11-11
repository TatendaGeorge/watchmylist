import express from 'express';
import {
    login,
    verifyToken,
    createUser,
    getUserById,
    getUsers,
    updateUserById,
    deleteUserById 
} from '../controllers/userController.js';
import userModelMiddleware from '../middlewares/userModelMiddleware.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/verifyToken').post(verifyToken);
router.route('/:tenantId/users/createUser').post(userModelMiddleware, createUser);
router.route('/users/getUsers').get(userModelMiddleware, getUsers);
router.route('/:tenantId/user/:id/getUserById').get(userModelMiddleware, getUserById);
router.route('/:tenantId/user/:id/updateUserById').put(userModelMiddleware, updateUserById);
router.route('/:tenantId/user/:id/deleteUserById').put(userModelMiddleware, deleteUserById);

export default router;

