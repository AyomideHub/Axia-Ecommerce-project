const User = require("../models/user.model");
const { BadRequest, NotFoundError, unAuthorizedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const currentUser = async (req, res) => {
  const user = await User.findById({ _id: req.user.id }).populate('Carts');
  if (!user) {
    throw new NotFoundError("No user is Available");
  }
  res.status(StatusCodes.OK).json(user.getUserDocs());
};

const getAllUsers = async (req, res) => {
  const user = await User.find({ role: "user" })
    .select(
      "-password -EmailVerificationToken -EmailVerificationTokenExpiredAt"
    )
    .sort("createdAt");
  if (!user) {
    throw new BadRequest("something went wrong");
  }
  res.status(StatusCodes.OK).json({ user, NoOfUsers: user.length });
};

const getSingleUser = async (req, res) => {
  const user = await User.findById({ _id: req.params.id });
  if (!user) {
    throw new NotFoundError("No user is Available");
  }

  res.status(StatusCodes.OK).json(user.getUserDocs());
};

const updateUserProfile = async (req, res) => {
  //user cant change their email and fullname
   const { PhoneNo, street, city, state, postalCode } = req.body;
  if (!PhoneNo || !street || !city || !state || !postalCode) {
    throw new BadRequest("Input field cannot be empty");
  }

  const user = await User.findByIdAndUpdate({ _id: req.user.id }, {PhoneNo, address: { street, city, state, postalCode }}, {runValidators: true, new: true} );
  if (!user) {
    throw new BadRequest("No accout associated with this user");
  }

  res.status(StatusCodes.OK).json(user.getUserDocs());
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete({ _id: req.user.id });
  if (!user) {
    throw new BadRequest("Something went wrong");
  }

  res.status(StatusCodes.OK).json({ message: "deleted successfully" });
};

module.exports = {
  currentUser,
  getAllUsers,
  getSingleUser,
  updateUserProfile,
  deleteUser,
};
