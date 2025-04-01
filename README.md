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
4. Create Task
```
POST /api/v1/tasks

```
5. Get A Task
```
GET /api/v1/tasks/:id

```
6. Update A Task
```
PATCH /api/v1/tasks/:id

```
7. Delete A Task
```
DELETE /api/v1/tasks/:id

```
8. Get All Tasks
```
GET /api/v1/tasks

```
9. Queries
```
GET /api/v1/tasks?

options:
status - completed or incomplete,
name,
category,
sort - Deadline, Category, createdAt
order - asc, dsc
page,
limit,

```