const Joi = require("joi");
const Account = require("models/account");

//회원가입, 로그인, 이메일, 아이디 존재 유무 확인, 로그아웃
//회원가입 아이디 4~15자, 비밀번호 최소 6자, 이메일형식
exports.localRegister = async (ctx) => {
  const schema = Joi.object().keys({
    //검증 정의
    name: Joi.string().alphanum().min(4).max(16).required(),
    id: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  const result = schema.validate(ctx.request.body); //검증

  if (result.error) {
    ctx.status = 404;
    return;
  }

  //아이디 / 이메일 중복체크
  let existing = null;

  try {
    existing = await Account.findByIdOrName(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  if (existing) {
    ctx.status = 409; // conflict

    // 어떤 값이 중복 되었는지 알려준다.
    ctx.body = {
      key: existing.id === ctx.request.body.id ? "id" : "name", //이메일이 중복이면 key가 id이라고 표시, 아니면 Accountname이라고 표시
    };

    return;
  }

  let account = null;

  try {
    account = await Account.localRegister(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  let token = null;
  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  ctx.body = account.name;
};

//로그인
exports.localLogin = async (ctx) => {
  //데이터 검증
  const schema = Joi.object().keys({
    id: Joi.string().required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { id, password } = ctx.request.body;

  let account = null;

  try {
    account = await Account.findById(id); //일단 해당하는 아이디가 있는지 찾음
  } catch (e) {
    ctx.throw(500, e);
  }

  console.log(account.validatePassword(password));
  if (!account || !account.validatePassword(password)) {
    //아이디가 없거나 비밀번호가 맞지 않으면 오류처리
    ctx.status = 403; //forbidden
    return;
  }

  let token = null;

  try {
    token = await account.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  ctx.body = account.serialize();
};

//이메일, 아이디 존재 유무 확인
exports.exists = async (ctx) => {
  const { value } = ctx.params;

  let account = null;
  try {
    account = await Account.findById(value);
    console.log(account);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: account !== null,
  };
};

// exports.exists = async (ctx) => {
//   const { value } = ctx.params;

//   console.log(value);
// };

//로그아웃
exports.localLogout = async (ctx) => {
  ctx.cookies.set("access_token", null, { httpOnly: true, maxAge: 0 }); //로그아웃하니 access_token null로 만들어줌
  ctx.status = 204; // no content
};

//쿠키에 access_token이 있다면, 현재 로그인된 유저의 정보를 알려주는 api
exports.check = (ctx) => {
  const { Account } = ctx.request;

  if (!Account) {
    ctx.status = 403; //forbidden
    return;
  }

  ctx.body = Account.profile;
};
