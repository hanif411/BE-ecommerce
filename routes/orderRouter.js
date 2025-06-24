import express from 'express';
import { createOrder, allOrder, detailOrder, currentUserOrder } from '../controllers/orderController.js';
import { protectedMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

//post /api/v1/order/
router.post('/',protectedMiddleware, createOrder);

//get /api/v1/order/
router.get('/', protectedMiddleware, adminMiddleware, allOrder);

//get /api/v1/order/:id
router.get('/:id', protectedMiddleware,adminMiddleware, detailOrder);

//get /api/v1/order/current/user
router.get('/current/user', protectedMiddleware, currentUserOrder);

export default router

