const mongoose = require("mongoose"); //mongoose로 모델을 만들고
const { Schema } = mongoose; //schema를 사용해야함
const crypto = require("crypto");
const { generateToken } = require("lib/token");

function hash(password) {
  //비밀번호 해시
  return crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");
}

const Account = new Schema({
  //schema 명세
  name: String,
  id: String,
  password: String,

  createAt: {
    type: Date,
    default: Date.now,
  },
});

Account.statics.findByName = function (name) {
  return this.findOne({ name }).exec();
};

Account.statics.findById = function (id) {
  return this.findOne({ id }).exec();
};

Account.statics.findByIdOrName = function ({ id, name }) {
  return this.findOne({
    //$or연산자를 통해 둘중에 하나를 만족하는 데이터를 찾는다.
    $or: [{ name }, { id }],
  }).exec();
};

Account.statics.localRegister = function ({ name, id, password }) {
  //데이터를 생성할땐 new this로 한다.
  const User = new this({
    name,
    id,
    password: hash(password), //비밀번호를 hash로 저장
  });

  return User.save();
};

Account.methods.validatePassword = function (password) {
  //함수로 전달받은 password의 hash값과 데이터에 담겨있는 hash값을 비교한다.
  console.log("before hash");
  console.log(password);
  const hashed = hash(password);
  console.log("after hash");
  console.log(hashed);
  return this.password === hashed;
};

Account.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

Account.methods.generateToken = function () {
  //lib/token에서 generateToken 함수 가져와서 사용
  //jwt에 담을 내용(payload)
  const payload = {
    //토큰에 넣을 데이터로
    _id: this._id, //id값과
    id: this.id, //profile 값을 넣는다.
    name: this.name,
  };

  return generateToken(payload, "account");
};

module.exports = mongoose.model("User", Account); //이렇게하면 자동으로 디비에 Accounts라고 테이블을 만들어준다.
// const Account = new Schema({
//   //schema 명세
//   profile: {
//     name: String,
//     thumbnail: {
//       type: String,
//       default: "/static/images/default_thumbnail.png",
//     },
//   },
//   id: {
//     type: String,
//   },

//   //소셜 계정으로 로그인할 경우 각 서비스에서 제공되는 id와 accessToken을 저장한다.
//   social: {
//     facebook: {
//       id: String,
//       accessToken: String,
//     },
//     google: {
//       id: String,
//       accessToken: String,
//     },
//   },

//   password: String, // 로컬 계정일 경우 비밀번호를 해싱해서 저장한다.
//   thoughtCount: {
//     type: Number,
//     default: 0, //서비스에서 포스트를 작성 할 때 마다 1씩 올라간다
//   },
//   createAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// Account.statics.findByname = function (name) {
//   return this.findOne({ "profile.name": name }).exec();
// };

// Account.statics.findByid = function (id) {
//   return this.findOne({ id }).exec();
// };

// Account.statics.findByidOrname = function ({ id, name }) {
//   return this.findOne({
//     //$or연산자를 통해 둘중에 하나를 만족하는 데이터를 찾는다.
//     $or: [{ "profile.name": name }, { id }],
//   }).exec();
// };

// Account.statics.localRegister = function ({ name, id, password }) {
//   //데이터를 생성할땐 new this로 한다.
//   const Account = new this({
//     profile: {
//       name,
//       //thumbnail값을 설정하지 않으면 기본값으로 설정된다.
//     },
//     id,
//     password: hash(password), //비밀번호를 hash로 저장
//   });

//   return Account.save();
// };

// Account.methods.validatePassword = function (password) {
//   //함수로 전달받은 password의 hash값과 데이터에 담겨있는 hash값을 비교한다.
//   const hashed = hash(password);
//   return this.password === hashed;
// };

// Account.methods.generateToken = function () {
//   //lib/token에서 generateToken 함수 가져와서 사용
//   //jwt에 담을 내용(payload)
//   const payload = {
//     //토큰에 넣을 데이터로
//     _id: this._id, //id값과
//     profile: this.profile, //profile 값을 넣는다.
//   };

//   return generateToken(payload, "Account");
// };

// module.exports = mongoose.model("Account", Account); //이렇게하면 자동으로 디비에 Accounts라고 테이블을 만들어준다.
