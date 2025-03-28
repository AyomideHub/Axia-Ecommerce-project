const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token
	// console.log(token)
	if(!token){
		return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg: "Unauthorized"})
	}
	const verifyToken = jwt.verify(token, process.env.JWT_SECRET)

	if(!verifyToken){
		return res.status(StatusCodes.UNAUTHORIZED).json({success: false, msg: "Unauthorized"})
	}

	req.user = verifyToken

	next()
}

const authenticateRole = async (req, res, next) =>{
	const role = req.user.role
	
	if (role !== 'admin'){
		return res.status(StatusCodes.FORBIDDEN).json({success: false, msg: "Unauthorized, You not an admin"})
	}

	next()

}

module.exports = {authenticateUser, authenticateRole}