const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authService = require('../auth');

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne( { "email" : email, "password" : password} );

  // 로그인 실패시
  if (!user) {
    return res.status(401).json({ error: 'Login failure' });
  }

  // 성공시 accessToken을 응답 객체에 부여해줌
  const accessToken = authService.signToken(user.id);
  res.json({ accessToken, user });
});

module.exports = router;