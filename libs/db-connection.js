const mongoose = require('mongoose');
const db = require('../config/database');
mongoose.Promise = global.Promise;

const MONGO_URL = db.url;

mongoose.connect(MONGO_URL, {useMongoClient: true});

mongoose.connection
  .once('open', () => console.log('Connected to the database!'))
  .on('error', err => console.log(err));

// to use id instead of _id
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

console.log(MONGO_URL)
module.exports = MONGO_URL;
