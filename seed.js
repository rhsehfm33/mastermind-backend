"use strict";

const mongoose = require("mongoose");
const User = require("./models/user");
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/mastermind",
  { useNewUrlParser: true, useFindAndModify: false }
);

User.deleteMany({})
  .then(() => {
    return User.create({
      email: "test@test.com",
      password: "123123",
      name: "Chris",
    });
  })
  .then((user) => console.log(user.email))
  .catch((error) => console.log(error.message))
  .then(() => {
    console.log("DONE");
    mongoose.connection.close();
  });
