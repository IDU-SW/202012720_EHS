const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
   const db = client.db('foods');
});

module.exports = MongoClient;