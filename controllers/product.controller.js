const { BadRequest, NotFoundError, unAuthorizedError } = require("../errors");
const { uploadToCloudinary } = require("../utils/cloudinary.upload");
const Product = require("../models/product.model");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require('../configs/cloudinary.config')

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

    const product = await Product.create({
      ...req.body,
      imageurl,
      imagepublicId,
      uploadBy: req.user.id,
    });

    res.status(StatusCodes.CREATED).json({ product });
  } catch (error) {
    next(error);
    // throw new BadRequest("Something went wrong, try again later");
  }
};

const getAllProducts = async (req, res) => {
  const {
    sort,
    order,
    page,
    limit,
    name,
    category,
    brand,
    size,
    freeshipping,
    price,
  } = req.query;
  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (category) {
    queryObject.category = { $regex: category, $options: "i" };
  }
  if (brand) {
    queryObject.brand = { $regex: category, $options: "i" };
  }
  if (size) {
    queryObject.size = size;
  }
  if (freeshipping) {
    queryObject.freeShipping = freeshipping;
  }
  if (price) {
    const [minPrice, maxPrice] = price.split("-");
    queryObject.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
    // console.log(queryObject)
  }

  const SortBy = sort || "createdAt";
  const OrderBy = order === "asc" ? 1 : -1;
  const sorting = {};
  sorting[SortBy] = OrderBy;
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 5;
  const Skip = (pageNumber - 1) * limitNumber;

  const TotalProducts = await Product.countDocuments(queryObject);
  const NumOfPages = Math.ceil(TotalProducts / limitNumber);

  const product = await Product.find(queryObject)
    .sort(sorting)
    .skip(Skip)
    .limit(limitNumber);
  if (!product) throw new NotFoundError("No Product found");
  res.status(StatusCodes.OK).json({
    product,
    TotalProducts,
    NumOfPages,
    ProductsPerPage: product.length,
  });
};

const getSingleProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById({ _id: productId });
  if (!product) throw new NotFoundError("No product with such ID");

  res.status(StatusCodes.OK).json({ success: true, product });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById({ _id: productId });
    if (!product) throw new NotFoundError("No product with such ID");
    for (const imageId of product.imagepublicId) {
      console.log(imageId)
      await cloudinary.uploader.destroy(imageId)
   }
   
   if(await Product.findByIdAndDelete({ _id: productId })){
    res
    .status(StatusCodes.OK)
    .json({ success: true, message: "product successfully deleted" });
   }
   } catch (error) {
    next(error)
   }
  
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findByIdAndUpdate(
    { _id: productId },
    req.body,
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
