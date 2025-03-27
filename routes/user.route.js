const express = require('express')
const router = express.Router()
const  {authenticateUser, authenticateRole} = require('../middelwares/authentication')
const {currentUser, getAllUsers, getSingleUser, updateUserProfile, deleteUser} = require('../controllers/user.controller')


router.route('/').get([authenticateUser,authenticateRole], getAllUsers).patch(authenticateUser, updateUserProfile).delete(authenticateUser, deleteUser)
router.get('/self', authenticateUser, currentUser)
router.route('/:id').get([authenticateUser,authenticateRole], getSingleUser)




module.exports = router