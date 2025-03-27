const express = require('express')
const router = express.Router()
const  {authenticateUser, authenticateRole} = require('../middelwares/authentication')
const {createCart, getAllCarts, getSingleCart, updateCart, deleteCart} = require('../controllers/cart.controller')


router.route('/').post(authenticateUser, createCart).get([authenticateUser,authenticateRole], getAllCarts)
router.route('/:id').patch(authenticateUser, updateCart).delete(authenticateUser, deleteCart)
router.get('/single', authenticateUser, getSingleCart)




module.exports = router