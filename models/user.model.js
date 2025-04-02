const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const addressSchema = mongoose.Schema({
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
});

/* The client/developer can make one of the users account the admin from the mongo database,
 by updating the user role to admin in the user model collection
 */

const UserSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "please provide your name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "please provide your email"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide valid email",
      },
    },
    password: {
      type: String,
      required: [true, "please provide your password"],
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    EmailVerify: {
      type: Boolean,
      default: false,
    },
    PhoneNo: {
      type: Number,
      required: [true, "please provide your Phone Number"],
      unique: true,
    },
    PhoneNoVerify: {
      type: Boolean,
      default: false,
    },
    address: addressSchema,
    TwoFaEnabled: Boolean,
    EmailVerificationToken: String,
    EmailVerificationTokenExpiredAt: Date,
    PasswordResetToken: String,
    PasswordResetTokenExpiredAt: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.getUserDocs = function () {
  return {
    ...this._doc,
    password: undefined,
    EmailVerificationToken: undefined,
    EmailVerificationTokenExpiredAt: undefined,
    // EmailVerify: undefined,
    // PhoneNoVerify: undefined
  };
};

UserSchema.virtual("Carts", {
  ref: "Cart",
  localField: "_id",
  foreignField: "userId",
  justOne: false,
});

UserSchema.methods.createCookies = function (res) {
  const token = jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return res.cookie("token", token, {
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_MODE === "production", // for dev mode
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", UserSchema);
