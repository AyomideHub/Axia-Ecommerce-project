const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide review text'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { productId: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Product').findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
	next(error)
    console.log(error);
  }
};

ReviewSchema.post('save', async function (next) {
	try {
		await this.constructor.calculateAverageRating(this.productId);
	} catch (error) {
		next(error)
		console.log(error)
	}
});

ReviewSchema.post('deleteOne',{ document: true, query: false }, async function (next) {
	try {
		await this.constructor.calculateAverageRating(this.productId);
	} catch (error) {
		next(error)
		console.log(error)
	}
});

module.exports = mongoose.model('Review', ReviewSchema);
