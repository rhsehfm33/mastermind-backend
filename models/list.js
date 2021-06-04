"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const List = require('./list');

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

// 이 리스트를 foregin key로 가지고 있는 list 삭제
listSchema.pre('remove', function(next) {
  const targetCard = Card.find({ listId: this.id });
  targetCard.remove().exec();
  next();
});

module.exports = mongoose.model("List", listSchema);
