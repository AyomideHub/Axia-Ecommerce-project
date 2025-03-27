const express = require('express')
const router = express.Router()
const  {authenticateUser, authenticateRole} = require('../middelwares/authentication')
const {createOrder, getAllOrders, getSingleOrder, updateOrder, cancelOrder} = require('../controllers/order.controller')


router.route('/').post(authenticateUser, createOrder).get([authenticateUser,authenticateRole], getAllOrders)
router.route('/:id').patch(authenticateUser, updateOrder).delete(authenticateUser, cancelOrder).get(authenticateUser, getSingleOrder)



module.exports = router