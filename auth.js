const jwt = require("jsonwebtoken");
const secret = "token secret";
const expiresIn = 365 * 24 * 3600; // 365 days

const auth = {
  // jwt 생성
  signToken(id) {
    return jwt.sign({ id }, secret, { expiresIn });
  },
  // jwt 인증 성공시 user 정보 추출해서 request header 에 추가
  ensureAuth() {
    return (req, res, next) => {
      const { authorization } = req.headers;
      if (!authorization) {
        res.status(401);
        throw Error("No Authorization headers");
      }

      try {
        req.user = this.verify(authorization);
      } catch (e) {
        res.status(401);
        throw e;
      }

      next();
    };
  },
  // jwt 인증
  verify(token) {
    // jwt bearer token 을 사용한다고 명시해놓음
    const realToken = token.replace(/^Bearer\s/, '');
    return jwt.verify(realToken, secret);
  },
};

module.exports = auth;
