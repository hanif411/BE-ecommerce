import { asyncHandler } from "../middlewares/asyncHandler.js";
import Product from "../models/productModels.js";

 export const createProduct = asyncHandler(async (req,res) =>{
    const newProduct = await Product.create(req.body)
    
    return res.status(201).json({
        message:"berhasil tambah produk",
        data:newProduct
    })
})

 export const allProduct = asyncHandler(async (req,res) =>{

    //fungsi jika ada request page dan limit
    let namequery = Product.find()
    
    
    if(req.query.nameproduct){
        queryobj = namequery.find({
            name : {$regex :req.query.nameproduct, $options:"i"}
        })
    }
    
    const excludedField = ["page", "limit", "nameproduct"];
    
    excludedField.forEach((element)=> delete queryobj[element])
    
    const queryobj = {...req.query}

    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    namequery = await namequery.find(queryobj).skip(skip).limit(limit);

    const products = await namequery;

    return res.status(200).json({
        message:"berhasil menampilkan data",
        data:products
        })

})

 export const detailProduct = asyncHandler(async (req,res) =>{
    const paramsId = req.params.id;
    const data = await Product.findById(paramsId);

    if(!data){
        res.status(404)
        throw new Error("data tidak ditemukan");
    }

   return  res.status(200).json({
    message:"berhasil menampilkan data",
    data
   })

})
 export const updateProduct = asyncHandler(async (req,res) =>{
    const paramsId = req.params.id;
    const data = await Product.findByIdAndUpdate(paramsId, 
        req.body,
        { 
            runValidators:false,
            new:true
        }
    );

    return res.status(201).json({
        message:"update berhasil",
        data
    })

})

 export const deleteProduct = asyncHandler(async (req,res) =>{
    const paramsid = req.params.id;
    await Product.findByIdAndDelete(paramsid);

    res.status(200).json({
        message:"berhasil menghapus data",
    })
})

 export const fileUpload = asyncHandler(async (req,res) =>{
    const file = req.file

    if(!file){
        res.status(400)
        throw new Error('silahkan upload file')
    }

    const imagefilename = file.filename;
    const pathimagefile = `/uploads/${imagefilename}`;

    res.status(200).json({
        message:"berhasil upload file",
        image: pathimagefile
    })
})