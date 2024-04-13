const jwt = require('jsonwebtoken');
APP_SECRET = 'appsecret';

// トークンを複合する関数
function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

// ユーザーidを取得する関数
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = header.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token found');
      }
      const { userId } = getTokenPayload;
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error('Not authenticated');
}

module.exports = {
  APP_SECRET,
  getUserId,
};
