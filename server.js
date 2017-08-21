const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

const Post = require('./api/models/post');
const Comment = require('./api/models/comment');

const server = express();
server.use(bodyParser.json());

const Routes = require('./api/routes/routes');

mongoose.Promise = global.Promise;
const connect = mongoose.connect(
    'mongodb://localhost/post-db',
    { useMongoClient: true }
);

/* eslint no-console: 0 */
connect.then(() => {
  const port = 3000;
  Routes(server);
  server.listen(3000);
  console.log(`Server listening on port ${port}`);
}, (err) => {
  console.log('\n**********************');
  console.log('ERROR: Failed to connect to MongoDB.');
  console.log('\n**********************');
});
