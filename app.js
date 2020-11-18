// imports dependencies and custom middlewares
const express = require('express');
const bodyParser = require('body-parser');
const CORS = require('cors');
const morgan = require('morgan');

const app = express();

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const firebaseAuthController = require('./controllers/firebaseAuthController');
const userRouter = require('./routes/userRoutes'); 
const customerRouter = require('./routes/customerRoutes'); 
const productRouter = require('./routes/productRoutes'); 
const brandRouter = require('./routes/brandRoutes');
const orderRouter = require('./routes/orderRoutes');
const merchantRouter = require('./routes/merchantRoutes');
const warehouseRouter = require('./routes/warehouseRoutes');

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(CORS());

// firebase authentication
app.use('/', firebaseAuthController.protect);

// mount routes
app.use('/api/v1/users', userRouter); 
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/products', productRouter); 
app.use('/api/v1/brands', brandRouter); 
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/merchants', merchantRouter); 
app.use('/api/v1/warehouses', warehouseRouter);

// all other routes are not found
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server.`, 404));
})

// run global error handler at the end of the stack
app.use(globalErrorHandler);

module.exports = app;