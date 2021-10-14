const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose"); // == require('mongoose).Types.ObjectId
const Account = require("models/account");

const Event = require("models/event");

//list 조회용
exports.list = async (ctx) => {
  const { id } = ctx.params; //url파라미터에서 id값을 가져옴
  console.log(`getOne id: ${id}`);

  let userTest;
  try {
    userTest = await Account.findById(id);
  } catch (e) {
    return ctx.throw(500, e);
  }

  let event;

  try {
    event = await Event.find({ id: userTest._id }); //특정 아이디를 가진 데이터 조회할 땐 findById함수를 사용
  } catch (e) {
    return ctx.throw(500, e);
  }

  if (!event) {
    //없으면
    ctx.status = 404;
    ctx.body = { massage: "event not found" };
    return;
  }

  ctx.body = event;
};

//단일 조회용
// exports.getOne = async (ctx) => {
//   const { id } = ctx.params; //url파라미터에서 id값을 가져옴
//   console.log(`getOne id: ${id}`);

//   let userTest;
//   try {
//     userTest = await Account.findById(id);
//   } catch (e) {
//     return ctx.throw(500, e);
//   }

//   let event;

//   try {
//     event = await Event.find({ id: userTest._id }); //특정 아이디를 가진 데이터 조회할 땐 findById함수를 사용
//   } catch (e) {
//     return ctx.throw(500, e);
//   }

//   if (!event) {
//     //없으면
//     ctx.status = 404;
//     ctx.body = { massage: "event not found" };
//     return;
//   }

//   ctx.body = event;
// };

exports.create = async (ctx) => {
  const { schedule, id } = ctx.request.body;

  let user = null;
  // {
  //   id: null,
  // }; //이거 하기 전에 정리부터 하자

  try {
    user = await Account.findById(id);
    // console.log(`user_id._id: ${user._id}`);
  } catch (e) {
    return ctx.throw(500, e);
  }
  console.log("모델 만들기 전");
  console.log(schedule);
  const event = new Event({
    schedule,
    id: user._id,
  });
  console.log("모델 만들기 후");
  console.log(event);

  //save()함수를 실행하면 이때 데이터베이스에 실제로 데이터를 작성한다.

  try {
    await event.save();
  } catch (e) {
    return ctx.throw(500, e);
  }
  //저장한 결과를 반환한다.  이렇게 저장하면 authors도 자동으로 스키마에 맞게 저장된다.
  ctx.body = event;
};

exports.delete = async (ctx) => {
  const { id } = ctx.params;

  try {
    await User.findByIdAndRemove(id).exec();
  } catch (e) {
    if (e.name === "CastError") {
      ctx.status = 400;
      return;
    }
  }

  ctx.status = 204; // No content
};

exports.replace = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  //검증할 스키마 준비
  const schema = Joi.object().keys({
    //객체의 field 검증
    schedule: {
      name: Joi.string().required(),
      start: Joi.string().required(), //date로 해야하나?
      end: Joi.string().required(), //date로 해야하나?
      note: Joi.string().required(),
      color: Joi.string().required(),
      timed: Joi.string().required(),
      todoList: Joi.array().items(Joi.string()).required(),
    },
    user: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body); //첫번째가 파라미터가 검증할 객체이고, 두번째가 스키마이다.

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  let event;

  try {
    event = await Event.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true, //이 값을 넣어주면 데이터가 존재하지 않을 경우 데이터를 새로 만들어준다.
      new: true, //이 값을 넣어주면 업데이트된 데이터를 반환한다.
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = event;
};

exports.update = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  let event;

  try {
    event = await Event.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    });
  } catch (e) {
    return ctx.throw(500, e);
  }

  ctx.body = event;
};
// const Joi = require("joi");
// const {
//   Types: { ObjectId },
// } = require("mongoose"); // == require('mongoose).Types.ObjectId

// const Book = require("models/book");

// //list 조회용
// exports.list = async (ctx) => {
//   let books;

//   //db건드리는건 다 try catch로 묶어서 하기
//   try {
//     books = await Book.find() //반환값은 promise여서 await 사용이 가능하다.
//       .sort({ _id: -1 }) //id를 역순으로 정렬한다.
//       .limit(3) //3개만 보여지도록 정렬
//       .exec(); // 이거를 붙여 줘야 실제로 데이터베이스에 요청이 된다.
//   } catch (e) {
//     return ctx.throw(500, e);
//   }

//   ctx.body = books;
// };

// //단일 조회용
// exports.getOne = async (ctx) => {
//   const { id } = ctx.params; //url파라미터에서 id값을 가져옴
//   let book;

//   try {
//     book = await Book.findById(id).exec(); //특정 아이디를 가진 데이터 조회할 땐 findById함수를 사용
//   } catch (e) {
//     return ctx.throw(500, e);
//   }

//   if (!book) {
//     //없으면
//     ctx.status = 404;
//     ctx.body = { massage: "book not found" };
//     return;
//   }

//   ctx.body = book;
// };

// exports.create = async (ctx) => {
//   const { title, authors, publishedDate, price, tags } = ctx.request.body;
//   const book = new Book({
//     title,
//     authors,
//     publishedDate,
//     price,
//     tags,
//   });

//   //save()함수를 실행하면 이때 데이터베이스에 실제로 데이터를 작성한다.

//   try {
//     await book.save();
//   } catch (e) {
//     return ctx.throw(500, e);
//   }
//   //저장한 결과를 반환한다.  이렇게 저장하면 authors도 자동으로 스키마에 맞게 저장된다.
//   ctx.body = book;
// };

// exports.delete = async (ctx) => {
//   const { id } = ctx.params;

//   try {
//     await Book.findByIdAndRemove(id).exec();
//   } catch (e) {
//     if (e.name === "CastError") {
//       ctx.status = 400;
//       return;
//     }
//   }

//   ctx.status = 204; // No content
// };

// exports.replace = async (ctx) => {
//   const { id } = ctx.params;

//   if (!ObjectId.isValid(id)) {
//     ctx.status = 400;
//     return;
//   }

//   //검증할 스키마 준비
//   const schema = Joi.object().keys({
//     //객체의 field 검증
//     title: Joi.string().required(),
//     authors: Joi.array().items(
//       Joi.object().keys({
//         name: Joi.string().required(),
//         email: Joi.string().email().required(),
//       })
//     ),
//     publishedDate: Joi.date().required(),
//     price: Joi.number().required(),
//     tags: Joi.array().items(Joi.string()).required(),
//   });

//   const result = schema.validate(ctx.request.body); //첫번째가 파라미터가 검증할 객체이고, 두번째가 스키마이다.

//   if (result.error) {
//     ctx.status = 400;
//     ctx.body = result.error;
//     return;
//   }

//   let book;

//   try {
//     book = await Book.findByIdAndUpdate(id, ctx.request.body, {
//       upsert: true, //이 값을 넣어주면 데이터가 존재하지 않을 경우 데이터를 새로 만들어준다.
//       new: true, //이 값을 넣어주면 업데이트된 데이터를 반환한다.
//     });
//   } catch (e) {
//     return ctx.throw(500, e);
//   }

//   ctx.body = book;
// };

// exports.update = async (ctx) => {
//   const { id } = ctx.params;

//   if (!ObjectId.isValid(id)) {
//     ctx.status = 400;
//     return;
//   }

//   let book;

//   try {
//     book = await Book.findByIdAndUpdate(id, ctx.request.body, {
//       new: true,
//     });
//   } catch (e) {
//     return ctx.throw(500, e);
//   }

//   ctx.body = book;
// };
