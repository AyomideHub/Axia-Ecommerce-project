require('dotenv').config()
require('express-async-errors');
const express = require('express')
const connectdb = require('./db/connectdb')
const cookieParser = require('cookie-parser')
const AuthRoute = require('./routes/Auth.Route')
const UserRoute = require('./routes/user.route')
const ProductRoute = require('./routes/product.route')
const CartRoute = require('./routes/cart.routes')
const OrderRoute = require('./routes/order.route')
const notFound = require('./middelwares/not-found')
const {ErrorHandler} = require('./middelwares/ErrorHandler')

const app = express()

// middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// routes
// app.get('/healthcheck', (req, res) => {
// 	res.status(200).send('<h1> GOOD </h1>')
// })
app.use('/api/v1/auth', AuthRoute)
app.use('/api/v1/users', UserRoute)
app.use('/api/v1/products', ProductRoute)
app.use('/api/v1/carts', CartRoute)
app.use('/api/v1/orders', OrderRoute)

// errors
app.use(notFound)
app.use(ErrorHandler)


const port = process.env.PORT || 5000
const start = async () => {
	try {
		await connectdb(process.env.MONGO_LOCAL)
		app.listen(port, () => {
			console.log('server is running');
		})
	} catch (error) {
		console.log(error);
	}
}

start()