## E-commerce Platform (handles the backend flow for E-commerce application)##

**Description:**

Build an e-commerce platform where users can browse products, add them to a cart, and make purchases.
Admin users can manage product listings, view orders, and update order statuses.

**Features:**

User registration and login
Product catalogue with categories
Shopping cart
Admin specific actions

## LOCAL SETUP ##
1. To run this project create a .env file and set the following variables
```
MONGO_URI=
JWT_SECRET=
COOKIES_SECRET=

```

2. Run the command below in the terminal to install the dependenies 
```
npm install

```

3. Run the command below in the terminal to start the server
```
npm run dev

```

## The client/developer can make one of the users account the admin from the mongo database by updating the role to admin in the user model collection

## End Point ##
1. Register
```
POST /api/v1/auth/register

```
2. Login
```
POST /api/v1/auth/login

```
3. Logout
```
POST /api/v1/auth/login

```
4. Create Product - Admin Only
```
POST /api/v1/products

```
5. Get A product
```
GET /api/v1/products/:id

```
6. Update A product
```
PATCH /api/v1/products/:id - Admin Only

```
7. Delete A product
```
DELETE /api/v1/products/:id

```
8. Get All products
```
GET /api/v1/products

```
9. Queries
```
GET /api/v1/products?
	sort - price, category,
    order,
    page,
    limit,
    name,
    category,
    brand,
    size,
    freeShipping - true or false,
    price  - set range min to max e.g price=15000-35000,

```
10. 