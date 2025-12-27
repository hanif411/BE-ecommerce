import { asyncHandler } from "../middlewares/asyncHandler.js";
import Product from "../models/productModels.js";
import Order from "../models/orderModel.js";
import midtransClient from "midtrans-client";

let snap = new midtransClient.Snap({
  // Set to true if you want Production Environment (accept real transaction).
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVERKEY,
});

const syncOrderWithMidtrans = async (order) => {
  if (order.paymentStatus !== "pending") return order;

  try {
    const statusResponse = await snap.transaction.status(order._id.toString());
    const midtransStatus = statusResponse.transaction_status.toLowerCase();

    let newStatus = order.paymentStatus;
    if (["settlement", "capture"].includes(midtransStatus)) {
      newStatus = "success";
    } else if (
      ["expired", "cancel", "deny", "expire"].includes(midtransStatus)
    ) {
      newStatus = "failed";
    }

    if (newStatus !== order.paymentStatus) {
      order.paymentStatus = newStatus;

      // Logic potong stok di sini kalau status berubah jadi success
      if (newStatus === "success") {
        for (const item of order.itemsdetail) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stokproduct: -item.productquantity },
          });
        }
      }
      await order.save();
    }
  } catch (error) {
    console.error(
      "Sync Error (mungkin transaksi belum dibuat):",
      error.message
    );
  }
  return order;
};

export const createOrder = asyncHandler(async (req, res) => {
  const { firstName, lastName, phone, email, cartItem } = req.body;

  if (!cartItem || cartItem.length === 0) {
    res.status(400);
    throw new Error("keranjang masih kosong");
  }

  let orderItem = [];
  let orderMidtrans = [];
  let total = 0;

  for (const cart of cartItem) {
    const productdata = await Product.findById(cart.product);
    if (!productdata) {
      res.status(400);
      throw new Error("produk tidak ditemukan");
    }
    const { nameproduct, priceproduct, _id, stokproduct, imageproduct } =
      productdata;

    if (cart.quantity > stokproduct) {
      res.status(404);
      throw new Error("jumlah product melebihi dari stok");
    }

    const singleproduct = {
      productname: nameproduct,
      productprice: priceproduct,
      product: _id,
      productquantity: cart.quantity,
      productimage: imageproduct,
    };

    const shortname = nameproduct.substring(0, 50);

    const singleproductMidtrans = {
      name: shortname,
      price: priceproduct,
      id: _id,
      quantity: cart.quantity,
    };

    orderItem = [...orderItem, singleproduct];

    orderMidtrans = [...orderMidtrans, singleproductMidtrans];

    total += priceproduct * cart.quantity;
  }

  const order = await Order.create({
    user: req.User._id,
    itemsdetail: orderItem,
    total,
    firstName,
    lastName,
    phone,
    email,
  });

  let parameter = {
    transaction_details: {
      order_id: order._id.toString(),
      gross_amount: total,
    },
    item_details: orderMidtrans,
    customer_details: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
    },
    callbacks: {
      finish: "http://localhost:5173/",
    },
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    let token = transaction.token;

    return res.status(201).json({
      success: true,
      order,
      total,
      token,
      redirect_url: transaction.redirect_url,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Midtrans Error:", error.message);
    res.status(500);
    throw new Error("Gagal membuat transaksi di Midtrans: " + error.message);
  }
});

export const allOrder = asyncHandler(async (req, res) => {
  const allorder = await Order.find();
  return res.status(200).json({
    data: allorder,
    success: true,
    message: "All orders retrieved successfully",
  });
});

export const detailOrder = asyncHandler(async (req, res) => {
  const detailorder = await Order.findById(req.params.id);
  return res.status(200).json({
    data: detailorder,
    success: true,
    message: "Order details retrieved successfully",
  });
});

export const currentUserOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.User._id });
  const updatedOrder = await Promise.all(
    orders.map((order) => syncOrderWithMidtrans(order))
  );
  return res.status(200).json({
    data: updatedOrder,
    success: true,
    message: "Current user orders retrieved successfully",
  });
});

export const callbackPayment = asyncHandler(async (req, res) => {
  let statusResponse = await snap.transaction.notification(req.body);

  let orderId = statusResponse.order_id;
  let transactionStatus = statusResponse.transaction_status;
  let fraudStatus = statusResponse.fraud_status;

  const orderData = await Order.findById(orderId);
  console.log(`order data = ${orderData}`);

  if (!orderData) {
    res.status(404);
    throw new Error("order tidak ditemukan");
  }

  if (transactionStatus == "capture") {
    if (fraudStatus == "accept") {
      orderData.status = "success";
      const orderProduct = orderData.itemsdetail;

      for (const itemProduct of orderProduct) {
        const product = await Product.findById(itemProduct.product);

        if (!product) {
          res.status(404);
          throw new Error("produk tidak ditemukan");
        }

        product.stokproduct = product.stokproduct - itemProduct.productquantity;

        await product.save();
      }
    }
  } else if (transactionStatus == "settlement") {
    orderData.status = "success";
    const orderProduct = orderData.itemsdetail;

    for (const itemProduct of orderProduct) {
      const product = await Product.findById(itemProduct.product);

      if (!product) {
        res.status(404);
        throw new Error("produk tidak ditemukan");
      }

      product.stokproduct = product.stokproduct - itemProduct.productquantity;

      await product.save();
    }
  } else if (transactionStatus == "deny") {
    orderData.status = "pending";
  } else if (transactionStatus == "cancel" || transactionStatus == "expire") {
    orderData.status = "failed";
  } else if (transactionStatus == "pending") {
    orderData.status = "pending";
  }

  await orderData.save();

  return res.status(200).send("payment notif berhasil");
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    res.status(404);
    throw new Error("Order tidak ditemukan");
  }

  order.orderStatus = orderStatus;
  const updatedOrder = await order.save();

  return res.status(200).json({
    success: true,
    message: "Status order berhasil diperbarui",
    data: updatedOrder,
  });
});
