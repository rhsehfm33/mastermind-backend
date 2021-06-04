"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

var listSchema = new Schema({
	boardId: { type: Schema.Types.ObjectId, ref: "Board" },
  title: {
    type: String,
  },
  pos: {
    type: Number,
    default: 65535,
  },
	cards: [{ type: Schema.Types.ObjectId, ref: "Card" }]
});

module.exports = mongoose.model("List", listSchema);
