const {StatusCodes} = require('http-status-codes')
const {CustomError}= require('./custom-error')

class ServerError extends CustomError {
	constructor(message) {
		super(message)
		this.statuscode = StatusCodes.INTERNAL_SERVER_ERROR
	}
}

module.exports = {ServerError}