const CustomError = require('../errors/custom-error')
const {StatusCodes} = require('http-status-codes')

const ErrorHandler = (err, req, res, next) => {
	let newError = {  
		StatusCode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		message: err.message || 'Something went wrong try again later'
	}

	// if (err instanceof CustomError){
	// 	return res.status(err.StatusCode).send(err.message)
	// }
	
	if (err.name && err.name === 'validationError'){
		newError.message = Object.values(err.errors).map((items) => items.message).join(', '),
		newError.StatusCode = 400	
	}
	if (err.code && err.code === 11000){
		newError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please another value`,
		newError.StatusCode = 400
	}
	if (err.name && err.name === 'castError'){
		newError.message = `No items found with id: ${err.Value}`,
		newError.StatusCode = 404	
	}
	console.log(err)
	res.status(newError.StatusCode).json({message: newError.message})


}

module.exports = {ErrorHandler}
