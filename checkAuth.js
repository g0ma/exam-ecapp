// Cookie情報からログイン状態をチェックするミドルウェア
const jwt = require("jsonwebtoken");
require('dotenv').config();
const env = process.env;

// Cookieからログイン情報を取得する
function LoginChk(cookie) {
    var userInfo = {
      name :'ゲスト',
      email: ''
    };
    try {
      const decode = jwt.verify(cookie, env.CK_SECKEY);
      userInfo = {
        name: decode.user,
        email: decode.email
      };
    } catch {
      console.log('not login');
    }
    return userInfo;
  }

  function chkLoggedin(name) {
    if (name != 'ゲスト') {
      return true;
    } else {
      return false;
    }
  }

  module.exports = {
    LoginChk: LoginChk,
    chkLoggedin: chkLoggedin
  };