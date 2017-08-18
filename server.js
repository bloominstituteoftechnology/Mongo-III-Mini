const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Post = require('./api/models/post');
const Comment = require('./api/models/comment');

const app  = express();

const corsOptions = {
    "origin": "*",
    "methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
};

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Postdb', { useMongoClient: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const routes = require('./api/routes/routes');
routes(app);

app.listen(3000);

console.log(`App listening on port 3000`);
