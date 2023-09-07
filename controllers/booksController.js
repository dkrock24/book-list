const {MongoClient, ObjectId } = require('mongodb');

function booksController(app, url, dbName) {
    
    function post(req, res) {

        (async function mongo() {
            let client;

            try {
                client = await MongoClient.connect(url);
                const db = client.db(dbName);
                const data = await db.collection("books").insertOne(req.body);
                res.json(data);
            } catch (error) {
                console.log(error.stack);
            }
            client.close;
        }());
    }

    function get(req, res) {

        const query = {};

        if (req.query.genre) {
            query.genre = req.query.genre;
        }

        (async function mongo() {
            let client;

            try {
                client = await MongoClient.connect(url);

                console.log('Connected to the mongo DB');
                const db = client.db(dbName);
                const data = await db.collection("books").find(query).toArray();
                res.json(data);

            } catch (error) {
                console.log(error.stack);
            }
            client.close;
        }());
    }

    return { post, get };
}

module.exports = booksController;