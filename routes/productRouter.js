import express from 'express';
import { adminMiddleware, protectedMiddleware } from '../middlewares/authMiddleware.js';
import { createProduct, allProduct, detailProduct, updateProduct, deleteProduct,fileUpload } from '../controllers/productController.js';
import upload from '../utils/uploadfilehandler.js';

const router = express.Router();

// create data product
// post /api/v1/product
// middleware owner
router.post('/',protectedMiddleware, adminMiddleware, createProduct)

// all data product
// post /api/v1/product
router.get('/',allProduct)

// detail data product
// post /api/v1/product
router.get('/:id',detailProduct)

// update data product
// post /api/v1/product
// middleware owner
router.put('/:id',protectedMiddleware, adminMiddleware, updateProduct)

// delete data product
// post /api/v1/product
// middleware owner
router.delete('/:id',protectedMiddleware, adminMiddleware,deleteProduct)

// file-upload data product
// post /api/v1/product
// middleware owner
router.post('/file-upload',protectedMiddleware, adminMiddleware, upload ,fileUpload)

export default router

