import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

dotenv.config();
cloudinary.config({
  cloud_name: "dot16pvfm",
  api_key: "768884591625614",
  api_secret: "TWSCyscUVfGbAG-lChYSayoQHoI",
});

const app = express();
const port = 3000;

//Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:3001",
  "https://fe-ecommerce-xxx.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server / postman
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// parent router
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

// error middleware tidak ada path nya
app.use(notFound);
// errorhandler ketika gagal ke database
app.use(errorHandler);

//server
app.listen(port, () => {
  console.log(`server sudah jalan di port ${port}`);
});

//conect to database
mongoose.connect(process.env.DATABASE, {}).then(() => {
  console.log("berhasil connect ke database");
});
