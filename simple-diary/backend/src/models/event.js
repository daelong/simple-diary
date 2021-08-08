// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const Author = new Schema({
//   //작가 정보 스키마
//   name: String,
//   email: String,
// });

// const Book = new Schema({
//   //책 정보 스키마
//   title: String,
//   authors: [Author],
//   publishedDate: Date,
//   price: Number,
//   tags: [String],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Book", Book); //스키마를 모델로 변환해서 export
// //모델 함수에선 두개의 파라미터를 필요로 하는데 첫번째는 해당 스크미의 이름이고 두번째는 스키마 객체이다. 스키마 이름을 정해두면 복수의 형태로 컬렉션 이름을 만들어준다.
// //즉, 실제 데이터베이스에 생성되는 컬렉션 이름은 books이다. 원하는 이름을 쓰고 싶다면 세번째 인자에 이름을 정해주면 된다.
const mongoose = require("mongoose");
const { Schema } = mongoose;

// const User = new Schema({
//   //유저 정보 스키마
//   id: String, //아이디 정보로 누구의 스케쥴인지 구분해야해서
// });

const Event = new Schema({
  //이벤트 정보 스키마
  schedule: {
    name: String,
    start: String,
    end: String,
    note: String,
    color: String,
    timed: String,
    todoList: Array,
  },
  id: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", Event); //스키마를 모델로 변환해서 export
//모델 함수에선 두개의 파라미터를 필요로 하는데 첫번째는 해당 스크미의 이름이고 두번째는 스키마 객체이다. 스키마 이름을 정해두면 복수의 형태로 컬렉션 이름을 만들어준다.
//즉, 실제 데이터베이스에 생성되는 컬렉션 이름은 books이다. 원하는 이름을 쓰고 싶다면 세번째 인자에 이름을 정해주면 된다.
