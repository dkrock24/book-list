const express = require('express');
require('dotenv').config()
const app = express();
const url = process.env.DB_HOST
const dbName = process.env.DB_NAME

const port = process.env.PORT || 30001;

const bookRouter = require('./routes/bookRouter')(url, app, dbName);

app.use('/api', bookRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my API from nodemon');
});

app.listen(port, () => {
    console.log('Running on port : ' + port);
});