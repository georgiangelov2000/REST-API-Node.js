const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;
const mongodbUrl = 'mongodb+srv://georgi:angelov@newcluster.cxigb.mongodb.net/?retryWrites=true&w=majority';

let _db;

const initDb = callback => {
    if (_db) {
        console.log("Database is already initialized!");
        return callback(null, _db);
    }
    MongoClient.connect(mongodbUrl)
        .then(client => {
            _db = client
            callback(null,_db);
        })
        .catch(error => {
            callback(error);
        })
}

const getDb = () => {
    if (!_db) {
        throw Error("Database not initialized");
    }
    return _db;
}

module.exports = {
    initDb,
    getDb
}