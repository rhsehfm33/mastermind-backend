"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }]
});

module.exports = mongoose.model("User", userSchema);
