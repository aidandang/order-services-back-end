const admin = require('../firebase/admin');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401))
  }

  const decodedToken = await admin.auth().verifyIdToken(token);

  if (decodedToken) {
    req.body.uid = decodedToken.uid;
    return next()
  } else {
    return next(new AppError('You are not authorized.', 401))
  }
})