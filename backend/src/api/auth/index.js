const Router = require("koa-router");

const auth = new Router();
const authCtrl = require("./auth.controller");

auth.post("/register/local", authCtrl.localRegister);

auth.post("/login/local", authCtrl.localLogin);

auth.get("/exists/id/:value", authCtrl.exists); //:key(email|username)은 key값이 email이나 username일때만 허용한다는 것이다.
// auth.get("/exists/id/:value", authCtrl.exists);

auth.post("/logout", authCtrl.localLogout);

auth.get("/check", authCtrl.check);

module.exports = auth;
