const express = require('express')
const router = express.Router()
const  {authenticateUser, authenticateRole} = require('../middelwares/authentication')
const {createProduct, deleteProduct, updateProduct, getAllProducts, getSingleProduct} = require('../controllers/product.controller')
const upload = require('../middelwares/upload')

router.route('/').post([authenticateUser, authenticateRole, upload.array('image', 5)] ,createProduct).get(getAllProducts)
router.route('/:id').get(getSingleProduct).patch([authenticateUser, authenticateRole], updateProduct).delete([authenticateUser, authenticateRole], deleteProduct)



module.exports = router