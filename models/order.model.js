const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema(
  {
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        Quantity: Number,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "failed", "processing", "delivered", "cancelled", "completed"],
      default: "pending",
    },
    paymentCompleted: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
