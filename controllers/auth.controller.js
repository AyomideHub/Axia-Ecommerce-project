const User = require("../models/user.model");
const crypto = require('crypto')
const {
  verificationTokenMail,
  ForgetPasswordTokenMail,
} = require("../utils/mail");
const { StatusCodes } = require("http-status-codes");
const {BadRequest, NotFoundError, unAuthorizedError, ServerError} = require('../errors')


/* The client/developer can make one of the users account the admin from the mongo database,
 by updating the user role to admin in the user model collection
 */

const register = async (req, res, next) => {

  const {fullname, email, password} = req.body
  if (!fullname || !email || !password ) {
    throw new BadRequest("input cannot be empty" );
  }

  const token = Math.floor(Math.random() * 900000 + 100000).toString();

  // const hashpassword= await bcrypt.hash(password, 10); - to be handled by the mongoose pre save hook middleware
  try {
    await verificationTokenMail(email, token);
    const user = await User.create({
      fullname,
      email,
      password,
      EmailVerificationToken: token,
      EmailVerificationTokenExpiredAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    
    res.status(StatusCodes.CREATED).json({
      success: true,
      msg: "registration successful",
      data: user.getUserDocs()  ,
    });
   
  } catch (error) {
    console.log(error)
    next(error)
    // throw new BadRequest('something went wrong, try again later')
  }

  
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate('Carts');
  if (!user) {
    throw new NotFoundError('No user with this Email')
  }
  
  const verifyPassword = await user.comparePassword(password)
  if (!verifyPassword) {
    throw new BadRequest('invalid credentials')
  }

  await user.createCookies(res);
  
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "login sucessfully",
    data: user.getUserDocs()
  });
};

const VerifyEmail = async (req, res) => {
  const { token } = req.body;
  let user = await User.findOne({
    EmailVerificationToken: token,
    EmailVerificationTokenExpiredAt: { $gt: Date.now() },
  });
  
  //console.log(user)
  if (!user) {
    throw new unAuthorizedError("Invalid token");
  }
  user.EmailVerificationToken = undefined;
  user.EmailVerificationTokenExpiredAt = undefined;
  user.EmailVerify = true;
  await user.save();

  //console.log(user)
  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Email verification successfull",
    data: user.getUserDocs()
  });
};

const ChangePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequest("input cannot be empty" );
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new unAuthorizedError("invalid user");
  }

  const checkPassword = await user.comparePassword(oldPassword);
  if (!checkPassword) {
    throw new BadRequest("wrong passsword");
  }

  // const hashpassword = await bcrypt.hash(newPassword, 10);
  //to be handled by the mongoose pre save hook

  user.password = newPassword;
  await user.save();
  res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, msg: "password changed successfully" , data: user.getUserDocs()});
};

const ForgetPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    throw new BadRequest("Input valid email address");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequest("No user associated with this email");
  }

  const PasswordResetToken = crypto.randomBytes(16).toString('hex')
  // console.log(PasswordResetToken)
  user.PasswordResetToken = PasswordResetToken;
  user.PasswordResetTokenExpiredAt = Date.now() + 1 * 60 * 60 * 1000;
  await user.save()

  try {
    await ForgetPasswordTokenMail(
      email,
      PasswordResetToken,
      `${process.env.CLIENT_URL}/api/v1/auth/reset-password/${PasswordResetToken}`
    );
    return res
      .status(StatusCodes.OK)
      .json({ success: true, msg: "Reset link sent successfully" });
  } catch (error) {
   next(error)
  }
};

const ResetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { token } = req.params;

  if (!newPassword || !confirmPassword) {
    throw new BadRequest("please provide password");
  }

  if (!(newPassword.toLowerCase() === confirmPassword.toLowerCase())) {
    throw new BadRequest("password doesnot match");
  }

  const user = await User.findOne({
    PasswordResetToken: token,
    PasswordResetTokenExpiredAt: { $gt: Date.now() },
  });

  if (!user) {
    throw new unAuthorizedError("Invalid reset link");
  }

  // const hashpassword = await bcrypt.hash(newPassword, 10);

  user.password = newPassword;
  user.PasswordResetToken = undefined;
  user.PasswordResetTokenExpiredAt = undefined;
  await user.save();

  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    msg: "password reset successfully",
    data: user.getUserDocs()
  });
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(StatusCodes.OK).json({ success: true, msg: "logout successful" });
};

module.exports = {
  register,
  login,
  VerifyEmail,
  ChangePassword,
  ForgetPassword,
  ResetPassword,
  logout,
};
