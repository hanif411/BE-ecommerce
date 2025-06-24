import { asyncHandler } from "./asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/authModels.js";
import dotenv from 'dotenv';

dotenv.config()

export const protectedMiddleware = asyncHandler(async (req, res, next) =>{
    let token;

    token = req.cookies.jwt;

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.User = await User.findById(decoded.id).select('-password');
            next();

        } catch (error) {
            res.status(401)
            throw new Error('not autorized not token failed')
        }
    } else{
        res.status(401)
        throw new Error('not autorized no token')
    } 
})

export const adminMiddleware = asyncHandler(async (req, res, next) =>{
    if(req.User.role === 'owner'){
        next()
    }else{
        res.status(401)
        throw new Error('not autorized as admin')
    }
})