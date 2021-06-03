"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

var boardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
  },
  bgColor: {
    type: String,
    default: "rgb(0, 121, 191)",
  },
	lists: [{ type: Schema.Types.ObjectId, ref: "List" }]
});

module.exports = mongoose.model("Board", boardSchema);
