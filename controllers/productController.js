import { asyncHandler } from "../middlewares/asyncHandler.js";
import Product from "../models/productModels.js";
import { v2 as cloudinary } from "cloudinary";

export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body);

  return res.status(201).json({
    message: "berhasil tambah produk",
    data: newProduct,
  });
});

export const allProduct = asyncHandler(async (req, res) => {
  const filterQuery = { ...req.query };

  const querytidakbutuh = ["page", "limit"];
  querytidakbutuh.forEach((el) => delete filterQuery[el]);

  Object.keys(filterQuery).forEach((el) => {
    if (filterQuery[el] === "") {
      delete filterQuery[el];
    }
  });

  if (filterQuery.nameproduct) {
    filterQuery.nameproduct = {
      $regex: filterQuery.nameproduct,
      $options: "i",
    };
  } else {
    delete filterQuery.nameproduct;
  }

  let query = Product.find(filterQuery);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const products = await query;

  const totalProducts = await Product.countDocuments(filterQuery);

  return res.status(200).json({
    message: "Berhasil menampilkan data",
    results: products.length,
    pagination: {
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      skip,
    },
    data: products,
  });
});

export const detailProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const data = await Product.findById(paramsId);

  if (!data) {
    res.status(404);
    throw new Error("data tidak ditemukan");
  }

  return res.status(200).json({
    message: "berhasil menampilkan data",
    data,
  });
});
export const updateProduct = asyncHandler(async (req, res) => {
  const paramsId = req.params.id;
  const data = await Product.findByIdAndUpdate(paramsId, req.body, {
    runValidators: false,
    new: true,
  });

  return res.status(201).json({
    message: "update berhasil",
    data,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const paramsid = req.params.id;
  await Product.findByIdAndDelete(paramsid);

  res.status(200).json({
    message: "berhasil menghapus data",
  });
});

export const fileUpload = asyncHandler(async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400);
    throw new Error("silahkan upload file");
  }

  const uploadstream = cloudinary.uploader.upload_stream(
    {
      folder: "/public/uploads",
      allowed_formats: ["jpg", "png"],
    },
    (error, result) => {
      if (error) res.status(500).json({ message: error });
      else res.status(200).json({ message: result });

      res.status(200).json({
        message: "berhasil upload file",
        url: result.secure_url,
        public_id: result.public_id,
      });
    }
  );

  uploadstream.end(file.buffer);
});
