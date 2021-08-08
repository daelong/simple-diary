const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

//jwt 토큰 생성

function generateToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload, //토큰에 넣을 데이터
      jwtSecret, //비밀키
      {
        expiresIn: "7d",
      },
      (error, token) => {
        if (error) reject(error);
        resolve(token);
      }
    );
  });
}

function decodeToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded);
    });
  });
}

exports.generateToken = generateToken;
exports.jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get("access_token");
  if (!token) return next();

  try {
    const decoded = await decodeToken(token);

    //토큰 만료일이 얼마 안남으면 토큰을 재발급한다.
    if (Date.now() / 1000 - decoded.iat > 60 * 60 * 24) {
      //   console.log(Date.now() / 1000 - decoded.iat > 60 * 60 * 24);
      const { _id, id } = decoded;
      const freshToken = await generateToken({ _id, id }, "account");
      ctx.cookies.set("access_token", freshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }
    //ctx.request.user에 디코딩된 값을 넣어준다.

    ctx.request.user = decoded; //나중에 라우트 핸들러에서 유저정보 조회용으로 사용
  } catch (e) {
    //토큰 validate 실패
    ctx.request.user = null;
  }

  return next();
};
