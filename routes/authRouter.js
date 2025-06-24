import express from 'express';
import { getUser, loginUser, logoutUser, registerUser } from '../controllers/authController.js';
import { protectedMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

//post /api/v1/auth/register
router.post('/register',registerUser)

//post /api/v1/auth/login
router.post('/login', loginUser)

//get /api/v1/auth/log out
router.get('/logout', logoutUser)

//get /api/v1/auth/getuser
router.get('/getuser', protectedMiddleware, getUser)

export default router

