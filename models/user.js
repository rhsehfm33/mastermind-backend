"use strict";

const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  boards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
});

userSchema.pre("save", function (next) {
  var user = this;

  // 비밀번호가 변경된 경우에만 해싱을 함
  if (!user.isModified("password")) {
    return next();
  }

  // salt 생성
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    // 생성된 salt를 이용해서 hash 값을 만듦
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }
      // hash 값으로 password 덮어쓰기
      user.password = hash;
      next();
    });
  });
});

// request로 받은 사용자의 비밀번호와 실제 그 사용자의 비밀번호가 일치하는지 검사하는 함수
// 에러가 없으면 그 결과를 isMatch 변수에 반환함
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
