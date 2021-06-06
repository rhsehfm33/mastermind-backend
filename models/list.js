"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const List = require('./list');
const Card = require('./card');

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

listSchema.methods.addCard = function(card) {
  this.cards.push(card);
  return this.save();
};

// 이 리스트를 foregin key로 가지고 있는 card 삭제
listSchema.pre('remove', function(next) {
  Card.deleteMany({ listId: this.id }).exec();
  next();
});

module.exports = mongoose.model("List", listSchema);
