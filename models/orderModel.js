import mongoose from "mongoose";

const { Schema } = mongoose;

const singleproduct = new Schema({
  productname: { type: String, required: true },
  productprice: { type: Number, required: true },
  productquantity: { type: Number, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});
const orderSchema = new Schema({
  total: {
    type: Number,
    required: [true, "total harga harus di isi"],
  },
  itemsdetail: [singleproduct],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  firstName: {
    type: String,
    required: [true, "nama depan harus di isi"],
  },
  lastName: {
    type: String,
    required: [true, "nama belakang harus di isi"],
  },
  phone: {
    type: String,
    required: [true, "nomor telepon harus di isi"],
  },
  email: {
    type: String,
    required: [true, "email harus di isi"],
  },
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    default: "pending",
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
