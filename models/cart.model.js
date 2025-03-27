const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
	{
		userId:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true
		},
		product:[
			{
				productId: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true},
				Quantity: {type: Number, default: 1},
			}
		]
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
