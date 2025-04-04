const Product = require('../models/product.model')
const Review = require('../models/review.model')
const { BadRequest, NotFoundError, unAuthorizedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
	const { productId, rating, comment} = req.body;
	const isValidProduct = await Product.findById({ _id: productId });

	if (!isValidProduct) {
	  throw new NotFoundError(`No product with id : ${productId}`);
	}
	const review = await Review.create({productId, rating, comment, userId: req.user.id});
	res.status(StatusCodes.CREATED).json({ review });
}

const getSingleReview = async (req, res) =>{

	const review = await Review.findById({ _id: req.params.id });
	if (!review) {
	  throw new CustomError.NotFoundError(`No review with id ${ req.params.id}`);
	}
	res.status(StatusCodes.OK).json({ review });
}

const deleteReview = async (req, res) => {

  const review = await Review.findOne({ _id: req.params.id, userId: req.user.id });
  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${req.params.id}`);
  }
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: 'Success! Review removed' });
}

/*
No update-review route but user can create multiple reviews
Np get-all-reviews route bcos once a user get a particular product, it will be automatically populated with all its reviews 

*/
module.exports = {createReview, getSingleReview, deleteReview}