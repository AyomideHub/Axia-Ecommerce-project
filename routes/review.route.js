const router = require('express').Router()
const {createReview, getSingleReview, deleteReview} = require('../controllers/review.controller')
const {authenticateUser} = require('../middelwares/authentication')

router.route('/').post(authenticateUser, createReview)
router.route('/:id').get(getSingleReview).delete(authenticateUser, deleteReview)

module.exports = router