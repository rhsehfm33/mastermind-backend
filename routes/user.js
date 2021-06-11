const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authService = require("../auth");

// 로그인
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  // 해당 email이 없을 시, 에러 메시지를 보냄
  if (!user) {
    return res.status(401).json({ error: "Login fail" });
  }

  // password와 encryptedPassword 같을 시, accessToken 부여
  user.comparePassword(password, function (err, isMatch) {
    if (err) {
      return res.end(err);
    }
    // email, password 일치 시에 accessToken 을 응답객체로 보냄
    if (isMatch) {
      const accessToken = authService.signToken(user.id);
      res.json({ accessToken, user });
    }
    // password 불일치시, 에러 메시지를 보냄
    else {
      res.status(401).json({ error: "Login fail" });
    }
  });
});

// 중복된 email 검사
router.post("/check_email", async (req, res, next) => {
  const { email } = req.body;
  const user = await User.find({ email: email });
  if (user.length === 0) {
    return res.status(200).end("You can use this email.");
  } else {
    return res.status(409).end("This email already exists!");
  }
});

// 회원 가입
router.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });

  // 회원가입 성공시 user 생성
  res.status(201).json({ user });
});

module.exports = router;
