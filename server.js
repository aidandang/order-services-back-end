const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = require('./app.js');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// db config
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(res => {
    console.log('MongoDB server connected.')
  });

// start node.js server on a specified port.
const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Node.js server listening at port: ${port}`));

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION: Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
});