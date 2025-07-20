import express from "express";
import {
  createOrder,
  allOrder,
  detailOrder,
  currentUserOrder,
  callbackPayment,
} from "../controllers/orderController.js";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

//post /api/v1/order/
router.post("/", protectedMiddleware, createOrder);

//get /api/v1/order/
router.get("/", protectedMiddleware, adminMiddleware, allOrder);

//get /api/v1/order/:id
router.get("/:id", protectedMiddleware, adminMiddleware, detailOrder);

//get /api/v1/order/current/user
router.get("/current/user", protectedMiddleware, currentUserOrder);

//post /api/v1/order/callback/midtrans
router.post("/callback/midtrans", callbackPayment);

export default router;
