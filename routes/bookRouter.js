const express = require('express');
const {MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const booksController = require('../controllers/booksController');

function routes(url,app, dbName) {

    const bookRouter = express.Router();

    app.use(bodyParser.urlencoded( { extended: true } ));
    app.use(bodyParser.json());

    const controller = booksController(app, url, dbName);

    bookRouter.route('/books')
        .post(controller.post)
        .get(controller.get);

    bookRouter.route('/book/:id')
        .put((req, res) => {
            (async function update() {
                let client;

                let newBook = req.body;
                var id = req.params.id;

                try {
                    client = await MongoClient.connect(url);

                    console.log('Connected to the mongo DB');
                    const db = client.db(dbName);
                    const data = await db.collection("books").updateOne(
                        { '_id': ObjectId(id) },
                        { $set: newBook },
                        { upsert: true }
                    );
                    res.json(data);

                } catch (error) {
                    console.log(error.stack);
                }
                client.close;
            }());
        })
        .get((req, res) => {
            let id = req.params.id;
            (async function mongo() {
                let client;

                try {
                    client = await MongoClient.connect(url);

                    console.log('Connected to the mongo DB');
                    const db = client.db(dbName);
                    const data = await db.collection("books").findOne({ '_id': ObjectId(id) });
                    res.json(data);

                } catch (error) {
                    console.log(error.stack);
                }
                client.close;
            }());
        })
        .delete((req, res) => {
            let id = req.params.id;
            (async function remove() {
                let client;

                try {
                    client = await MongoClient.connect(url);

                    console.log('Connected to the mongo DB');
                    const db = client.db(dbName);
                    const data = await db.collection("books").deleteOne({ '_id': ObjectId(id) });
                    res.json(data);

                } catch (error) {
                    console.log(error.stack);
                }
                client.close;
            }());
        })
        .patch( (req, res) => {
            let id = req.params.id;
            
            (async function patch() {
                let client;

                try {
                    client = await MongoClient.connect(url);

                    console.log('Connected to the mongo DB');
                    const db = client.db(dbName);
                    const data = await db.collection("books").findOne({ '_id': ObjectId(id) });
                    

                    Object.entries(req.body).forEach( (item) => {
                        const key = item[0];
                        const value = item[1];
                        data[key] = value;
                    });

                    delete data._id;
                    console.log(data);
                    const results = await db.collection("books").updateOne(
                        { '_id': ObjectId(id) },
                        { $set: data },
                        { upsert: true }
                    );
                    
                    res.json(results);

                } catch (error) {
                    console.log(error.stack);
                }
                client.close;
            }());
        });

    return bookRouter;
}

module.exports = routes;