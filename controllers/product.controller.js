const { BadRequest, NotFoundError, unAuthorizedError } = require("../errors");
const { uploadToCloudinary } = require("../utils/cloudinary.upload");
const Product = require("../models/product.model");
const { StatusCodes } = require("http-status-codes");

const createProduct = async (req, res, next) => {
  if (!req.files) {
    throw new BadRequest("Images of Items are needed");
  }

  try {
    
    const imageurl = [];
    const imagepublicId = [];
    
    for (const file of req.files) {
      const { url, publicId } = await uploadToCloudinary(file.path);
      imageurl.push(url);
      imagepublicId.push(publicId);
    }
  
    const product = await Product.create({ ...req.body, imageurl,
      imagepublicId,
      uploadBy: req.user.id});

    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    next(error)
    // throw new BadRequest("Something went wrong, try again later");
  }
};

const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ updatedAt: 1 });
  res
    .status(StatusCodes.OK)
    .json({ success: true, products, NumberOfProducts: products.length });
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById({ _id: productId });
  if (!product) throw new NotFoundError("No product with such ID");

  res.status(StatusCodes.OK).json({ success: true, product });
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findByIdAndDelete({ _id: productId });
  if (!product) throw new NotFoundError("No product with such ID");

  res
    .status(StatusCodes.OK)
    .json({ success: true, message: "product successfully deleted" });
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findByIdAndUpdate(
    { _id: productId}, req.body,
    { runValidators: true, new: true }
  );

  if (!product) throw new NotFoundError("No product with such ID");

  res.status(StatusCodes.OK).json({ success: true, product });
};

module.exports = {
  createProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  getAllProducts,
};
