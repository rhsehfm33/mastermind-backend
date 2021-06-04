const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authService = require('../auth');

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne( { "email" : email, "password" : password} );

  // for debug
  // console.log(user)

  // when login fail
  if (!user) {
    return res.status(401).json({ error: 'Login failure' });
  }

  // give accessToken when login succeeded
  const accessToken = authService.signToken(user.id);
  res.json({ accessToken, user });
});

module.exports = router;