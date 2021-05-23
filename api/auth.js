const User = require('../models/user')
const authService = require('../auth')

const login = async (req, res, next) => {
  const { email, password } = req.body
  
  const user = await User.findOne( { "email" : email, "password" : password} )

  // for debug
  // console.log(user)

  if (!user) {
    return res.status(401).json({ error: 'Login failure' })
  }

  const accessToken = authService.signToken(user.id)
  res.json({ accessToken, user })
}

module.exports = {
  login
}