import express from "express";
import {
  createOrder,
  allOrder,
  detailOrder,
  currentUserOrder,
  callbackPayment,
  updateOrderStatus,
} from "../controllers/orderController.js";
import {
  protectedMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protectedMiddleware, createOrder);
router.get("/", protectedMiddleware, adminMiddleware, allOrder);
router.get("/current/user", protectedMiddleware, currentUserOrder);
router.post("/callback/midtrans", callbackPayment);
router.patch(
  "/status/:id",
  protectedMiddleware,
  adminMiddleware,
  updateOrderStatus
);
router.get("/:id", protectedMiddleware, adminMiddleware, detailOrder);

export default router;
