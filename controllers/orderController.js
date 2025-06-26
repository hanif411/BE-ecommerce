import { asyncHandler } from "../middlewares/asyncHandler.js";
import Product from "../models/productModels.js";
import User from "../models/authModels.js";
import Order from "../models/orderModel.js";

 export const createOrder = asyncHandler(async (req,res) =>{

    const {firstName, lastName,phone, email, cartItem} = req.body

    if(!cartItem || cartItem.length === 0){
        res.status(400)
        throw new Error("keranjang masih kosong");
    }

    let orderItem = [];
    let total = 0;

    for (const cart of cartItem) {
        const productdata = await Product.findById(cart.product)
        if(!productdata){
            res.status(400)
            throw new Error("produk tidak ditemukan");
        }
        const {nameproduct, priceproduct, _id} =  productdata 
        const singleproduct ={
            productname : nameproduct,
            productprice : priceproduct,
            product : _id,
            productquantity: cart.quantity
        }
        orderItem =  [...orderItem, singleproduct]

        total += priceproduct * cart.quantity
    }

    const order = await Order.create({
        user: req.User._id,
        itemsdetail : orderItem,
        total,
        firstName,
        lastName,
        phone,
        email
    })


    return res.status(201).json({
        success: true,
        order,
        total,
        message: "Order created successfully",
    })
})

export const allOrder = asyncHandler(async (req,res) =>{
    const allorder = await Order.find()
    return res.status(200).json({
        allorder,
        success: true,
        message: "All orders retrieved successfully",
        })
})

export const detailOrder = asyncHandler(async (req,res) =>{
    const detailorder = await Order.findById(req.params.id)
    return res.status(200).json({
        data : detailorder,
        success: true,
        message: "Order details retrieved successfully",
        })
})

export const currentUserOrder = asyncHandler(async (req,res) =>{
    const order = await Order.find({user: req.User._id})
    return res.status(200).json({
        data :order,
        success: true,
        message: "Current user orders retrieved successfully",
        })
})