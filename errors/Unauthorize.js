const {StatusCodes} = require('http-status-codes')
const {CustomError}= require('./custom-error')

class unAuthorizedError extends CustomError {
	constructor(message) {
		super(message)
		this.statuscode = StatusCodes.UNAUTHORIZED
	}
}

module.exports = {unAuthorizedError}