const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const { BadRequest, NotFoundError, unAuthorizedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createOrder = async (req, res, next) => {
  //const { street, PhoneNo, city, state, postalCode} = req.body
  try {
    const carts = await Cart.findOne({ userId: req.user.id }).populate({
      path: "product",
      populate: { path: "productId" },
    });
    if (!carts || carts.product.length <= 0) {
      throw new BadRequest("No Items in your Cart");
    }
    let total = 0;
    let productPrice = 0;
    const cartItems = [];
    let deliveryFee = 0;

    for (const cart of carts.product) {
      let price;
      price = cart.productId.price * cart.Quantity;
      productPrice = productPrice + price;
      total = total + price;
      if (cart.productId.freeShipping) {
        cartItems.push(cart);
      } else {
        deliveryFee = 0.015 * total;
        total = total + deliveryFee;
        cartItems.push(cart);
      }
    }
    deliveryFee = deliveryFee < 1000 ? 1000 : deliveryFee;

    const user = await User.findById({ _id: req.user.id });
    const PhoneNo = req.body.PhoneNo || user.address.PhoneNo;
    const street = req.body.street || user.address.street;
    const city = req.body.city || user.address.city;
    const state = req.body.state || user.address.state;
    const postalCode = req.body.postalCode || user.address.postalCode;

    const order = await Order.create({
      cartItems,
      userId: user._id,
      PhoneNo,
      productPrice,
      deliveryFee,
      total,
      deliveryAddress: { street, city, state, postalCode },
    });
    if (order) {
      await Cart.findOneAndDelete({ userId: req.user.id });
      return res.status(StatusCodes.CREATED).json(order);
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "failed" });
  } catch (error) {
    console.log(error);
    next(error)
  }
};

const getAllOrders = async (req, res) => {
	const orders = await Order.find().sort({updatedAt: 1}).populate({path: "cartItems", populate: { path: "productId"}}).populate({path: "userId", select: '_id name email'});
	if (!orders) throw new NotFoundError("No order found");

	//const count = await Cart.countDocuments()
	res.status(StatusCodes.OK).json({orders, noOfOrders: orders.length});
};

const getSingleOrder = async (req, res) => {
	const order = await Order.findById(req.params.id).populate({path: "cartItems", populate: { path: "productId"}}).populate({path: "userId", select: '_id name email'});
	if (!order) throw new NotFoundError("No order found");

	//const count = await Cart.countDocuments()
	res.status(StatusCodes.OK).json(order);
};


const cancelOrder = async (req, res) => {
	const order = await Order.findById(req.params.id)
	if (!order) throw new NotFoundError("No order found");
	if (order.status === "processing"){
		return res.status(StatusCodes.BAD_REQUEST).JSON({message: "Order cannot be cancelled!! Order is been processed ", order})
	} else if (order.status === "delivered" || order.status === "completed"){
		return res.status(StatusCodes.BAD_REQUEST).JSON({message: "Order cannot be cancelled, it has been delivered/completed", order})
	} else{
		order.status = "cancelled" 
		await order.save()
		return res.status(StatusCodes.OK).JSON({message: "your Order has been cancelled", order})
	}
};

module.exports = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  cancelOrder,
};
