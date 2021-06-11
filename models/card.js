"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const List = require("./list");

var cardSchema = new Schema({
  listId: { type: Schema.Types.ObjectId, ref: "List" },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  pos: {
    type: Number,
    default: 65535,
  },
});

module.exports = mongoose.model("Card", cardSchema);
