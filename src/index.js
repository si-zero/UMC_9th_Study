import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Passport
import passport from "passport";

// Google
import { googleStrategy, jwtStrategy } from "./auth.config.js";

// Swagger 관련 라이브러리
import swaggerAutogen from "swagger-autogen"; // Express의 라우터 코드에서 Swagger 문서를 자동으로 생성하는 라이브러리
import swaggerUiExpress from "swagger-ui-express"; // Express의 라우터 코드에서 Swagger 문서를 자동으로 생성하는 라이브러리
import { createUser, getUser, getUserByEmail } from "./controllers/user.controller.js";
import { getStoreController, createStoreController } from "./controllers/store.controller.js";
import { getReviewsController, createReviewController } from "./controllers/review.controller.js";
import { getMissionByMissionIdController ,createMissionController, getMissionsController } from "./controllers/mission.controller.js";
import { addUserMissionController, updateUserMissionStatusController } from "./controllers/userMission.controller.js";
import users from './routes/userRoutes.js'

dotenv.config();

passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
const port = process.env.PORT;

// 공통 응답 사용할 수 있는 헬퍼 응답 함
app.use((req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
});

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);

app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 9th",
      description: "UMC 9th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan('dev')); // dev 의 로그 포맷 제공
app.use(cookieParser()); // 쿠키 파싱(해석)해서 다루기 쉽게 만드는 미들웨어

app.use(passport.initialize());

// 쿠키 만드는 라우터 
app.get('/setcookie', (req, res) => {
    // #swagger.ignore = true
    // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
    res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
    res.send('쿠키가 생성되었습니다!');
});

// 쿠키 읽는 라우터 
app.get('/getcookie', (req, res) => {
    // #swagger.ignore = true
    // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
    const myCookie = req.cookies.myCookie; 
    
    if (myCookie) {
        console.log(req.cookies); // { myCookie: 'hello' }
        res.send(`당신의 쿠키: ${myCookie}`);
    } else {
        res.send('쿠키가 없습니다.');
    }
});

BigInt.prototype.toJSON = function() {
  // 'n' 접미사를 제외하고 문자열로 반환
  return this.toString(); 
};

BigInt.prototype.toJSON = function() {
  // 'n' 접미사를 제외하고 문자열로 반환
  return this.toString(); 
};

app.use('/api/v1/users', users);
// app.post("/api/v1/users", createUser);
// app.get("/api/v1/users/:user_id", getUser);
// app.get("/api/v1/users", getUserByEmail);

// 가게 생성 및 조회
app.post("/api/v1/store", createStoreController);
app.get("/api/v1/store/:id", getStoreController);

// 리뷰 생성 및 조회
app.post("/api/v1/stores/:storeId/reviews", createReviewController);
app.get("/api/v1/stores/:storeId/reviews", getReviewsController);

// 미션 생성 및 조회
app.post("/api/v1/missions", createMissionController);
app.get("/api/v1/mission/:missionId", getMissionByMissionIdController)
app.get("/api/v1/missions", getMissionsController);

// 사용자 미션 생성 및 업데이트
app.post('/api/v1/users/:userId/missions', addUserMissionController)
app.patch('/api/v1/users/:userId/missions/:missionId', updateUserMissionStatusController)

// 마이 페이지
const isLogin = passport.authenticate('jwt', { session: false });

app.get('/mypage', isLogin, (req, res) => {
  res.status(200).success({
    message: `인증 성공! ${req.user.name}님의 마이페이지입니다.`,
    user: req.user,
  });
});

// 소셜 로그인
app.get("/oauth2/login/google", 
  passport.authenticate("google", { 
    session: false 
  })
);
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
	  session: false,
    failureRedirect: "/login-failed",
  }),
  (req, res) => {
    const tokens = req.user; 

    res.status(200).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          message: "Google 로그인 성공!",
          tokens: tokens, // { "accessToken": "...", "refreshToken": "..." }
      }
    });
  }
);

// 전역 오류 처리를 위한 미들웨어
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});