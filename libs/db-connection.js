const mongoose = require("mongoose");
const db = require("../config/database");
mongoose.Promise = global.Promise;

const MONGO_URL = db.url;

mongoose.connect(MONGO_URL, { useMongoClient: true });

mongoose.connection
  .once("open", () => console.log("Connected to the database!"))
  .on("error", (err) => console.log(err));

// _id 대신 id를 사용하기 위해 mongoose를 세팅함
// 이는 프론트의 json data와 맞추기 위함임
mongoose.set("toJSON", {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  },
});

console.log(MONGO_URL);
module.exports = MONGO_URL;
