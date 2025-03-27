const express = require('express')
const router = express.Router()
const  {authenticateUser} = require('../middelwares/authentication')
const {register, login, VerifyEmail, ChangePassword, ForgetPassword, ResetPassword, logout} = require('../controllers/auth.controller')

router.post('/register', register)
router.post('/verify-email', VerifyEmail)
router.post('/login', login)
router.post('/change-password',authenticateUser, ChangePassword)
router.post('/forget-password', ForgetPassword)
router.post('/reset-password/:token', ResetPassword)
router.post('/logout', authenticateUser, logout)
module.exports = router