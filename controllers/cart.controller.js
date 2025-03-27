const { BadRequest, NotFoundError, unAuthorizedError } = require("../errors");
const Cart = require("../models/cart.model");
const { StatusCodes } = require("http-status-codes");

const createCart = async (req, res) => {
  // to add products to cart if the user already as an open cart new items will be added to the cart else new cart will be created
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $push: { product: req.body } },
    { runValidators: true, new: true }
  )

  if (cart) {
    return res.status(StatusCodes.CREATED).json(cart);
  } else {
    const cart = await Cart.create({
      userId: req.user.id,
      product: req.body,
    })

    if (!cart) throw new BadRequest("select and items");

    res.status(StatusCodes.CREATED).json(cart);
  }
};

const getAllCarts = async (req, res) => {
  const cart = await Cart.find().sort({updatedAt: 1}).populate({path: "product", populate: { path: "productId"}}).populate({path: "userId", select: '_id name email'});
  if (!cart) throw new NotFoundError("No Cart found");

  //const count = await Cart.countDocuments()

  res.status(StatusCodes.OK).json({cart, noOfCarts: cart.length});
};

const getSingleCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.id })
    .populate({ path: "product", populate: { path: "productId", select: 'name price imageurl'}}).populate({path: "userId", select: '_id name email'});;
  if (!cart) throw new BadRequest("No Cart found");
  // console.log(cart.product.length)
  res.status(StatusCodes.OK).json({cart, NoOfItems: cart.product.length});
};

const updateCart = async (req, res) => {
  // to remove an item from  cart, if the is no more items in the cart the cart will be deleted

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { product: { _id: req.params.id } } },
    { runValidators: true, new: true }
  ).populate({ path: "product", populate: { path: "productId", select: 'name price imageurl'}}).populate({path: "userId", select: '_id name email'});;
  if (!cart) throw new BadRequest("No Cart found");

  if (cart.product.length <= 0) {
    await Cart.findOneAndDelete({ userId: req.user.id });
    return res.status(StatusCodes.OK).json({ message: "Your cart is Empty" });
  }

  res.status(StatusCodes.OK).json(cart);
};

const deleteCart = async (req, res) => {
  // to delete the whole cart completely
  const cart = await Cart.findOneAndDelete({ userId: req.user.id });
  if (!cart) throw new BadRequest("No Cart found");

  res.status(StatusCodes.OK).json({message: 'Cart deleted successfully'});
};

module.exports = {
  createCart,
  getAllCarts,
  getSingleCart,
  updateCart,
  deleteCart,
};
