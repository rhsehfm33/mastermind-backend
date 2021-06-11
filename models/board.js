"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const List = require("./list");

let boardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: "rgb(0, 0, 0)",
  },
  lists: [{ type: Schema.Types.ObjectId, ref: "List" }],
});

boardSchema.methods.addList = function (list) {
  this.lists.push(list);
  return this.save();
};

// 이 보드를 foregin key로 가지고 있는 list 삭제
boardSchema.pre("remove", function (next) {
  List.find({ boardId: this._id }).then(function (lists) {
    lists.forEach(function (list) {
      list.remove();
    });
  });
  next();
});

module.exports = mongoose.model("Board", boardSchema);
