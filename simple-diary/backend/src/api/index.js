const Router = require("koa-router");

const api = new Router();
const events = require("./event");
const auth = require("./auth");

api.use("/auth", auth.routes());
api.use("/events", events.routes());
// api.get("/events", (ctx, next) => {
//   ctx.body = "GET " + ctx.request.path;
// });

module.exports = api;

// const Router = require("koa-router");

// const api = new Router();
// const books = require("./books");
// const auth = require("./auth");

// api.use("/auth", auth.routes());
// api.use("/books", books.routes());
// // api.get("/books", (ctx, next) => {
// //   ctx.body = "GET " + ctx.request.path;
// // });

// module.exports = api;
