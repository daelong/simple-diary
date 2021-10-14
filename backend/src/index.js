require("dotenv").config(); //.env파일에서 환경변수 불러오기 dotenv는 환경변수들을 파일에 넣고 사용할 수 있게 해준다.

const koa = require("koa");
const Router = require("koa-router");

const app = new koa();
const router = new Router();
const api = require("./api");
const { PORT, MONGO_URI } = process.env;
const { jwtMiddleware } = require("lib/token");

const mongoose = require("mongoose");
const bodyParser = require("koa-bodyParser");

mongoose //데이터베이스 연결
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("Successfully connected to mongodb");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(bodyParser()); //라우트코드보다 앞에 있어야한다.
app.use(jwtMiddleware);
router.use("/api", api.routes()); //api 라우트를 /api경로 하위 라우트로 설정
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000; //PORT값이 없으면 4000사용
app.listen(port, () => {
  console.log(`simple diary server is listening to port ${port}`);
});
