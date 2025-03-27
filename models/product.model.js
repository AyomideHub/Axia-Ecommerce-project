const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide product name"],
      maxlength: [100, "Name can not be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      maxlength: [1000, "Description can not be more than 1000 characters"],
    },
    imageurl: {
      type: [String]
    },
    imagepublicId: {
      type: [String]
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
    },
    company: {
      type: String,
    },
    colours: {
      type: [String],
      default: ["#000"],
      required: true,
    },
    size: {
      type: [String],
      default: ["Medium"],
      required: true,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    uploadBy:{
      type: mongoose.Schema.Types.ObjectId,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);


