import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  nameproduct: {
    type: String,
    required: [true, "nama produk harus di isi"],
  },
  priceproduct: {
    type: Number,
    required: [true, "harga produk harus di isi"],
  },
  descriptionproduct: {
    type: String,
    required: [true, "deskripsi produk harus di isi"],
  },
  categoryproduct: {
    type: String,
    required: [true, "kategori produk harus di isi"],
  },
  imageproduct: {
    type: String,
    required: [true, "gambar produk harus di isi"],
  },
  stokproduct: {
    type: Number,
    required: [true, "stok produk harus di isi"],
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
