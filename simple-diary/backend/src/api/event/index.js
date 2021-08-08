const Router = require("koa-router");

const events = new Router();
const eventsCtrl = require("./events.controller");
// events관련 api를 정의해 둔 파일을 require해서 바로 사용할 수 있음

events.get("/:id", eventsCtrl.list);

events.post("/", eventsCtrl.create);

events.delete("/:id", eventsCtrl.delete);

events.put("/:id", eventsCtrl.replace);

events.patch("/:id", eventsCtrl.update);

module.exports = events;
