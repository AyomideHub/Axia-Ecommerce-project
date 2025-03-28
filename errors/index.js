const {unAuthorizedError} = require('./Unauthorize')
const {BadRequest} = require('./BadRequest')
const {NotFoundError} = require('./NotFoundError')
const {ServerError} = require('./serverError')

module.exports = {unAuthorizedError, BadRequest, NotFoundError, ServerError}