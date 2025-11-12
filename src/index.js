import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { createUser, getUser, getUserByEmail } from "./controllers/user.controller.js";
import { getStoreController, createStoreController } from "./controllers/store.controller.js";
import { getReviewsController, createReviewController } from "./controllers/review.controller.js";
import { createMissionController, getMissionsController } from "./controllers/mission.controller.js";
import { addUserMissionController, updateUserMissionStatusController } from "./controllers/userMission.controller.js";

dotenv.config();

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

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(morgan('dev')); // dev 의 로그 포맷 제공
app.use(cookieParser()); // 쿠키 파싱(해석)해서 다루기 쉽게 만드는 미들웨어

app.get('/test', (req, res) => {
  res.send('Hello!');
});

// 쿠키 만드는 라우터 
app.get('/setcookie', (req, res) => {
    // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
    res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
    res.send('쿠키가 생성되었습니다!');
});

// 쿠키 읽는 라우터 
app.get('/getcookie', (req, res) => {
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users", createUser);
app.get("/api/v1/users/:user_id", getUser);
app.get("/api/v1/users", getUserByEmail);

// 가게 생성 및 조회
app.post("/api/v1/store", createStoreController);
app.get("/api/v1/store/:id", getStoreController);

// 리뷰 생성 및 조회
app.post("/api/v1/stores/:storeId/reviews", createReviewController);
app.get("/api/v1/stores/:storeId/reviews", getReviewsController);

// 미션 생성 및 조회
app.post("/api/v1/missions", createMissionController);
app.get("/api/v1/missions", getMissionsController);

// 사용자 미션 생성 및 업데이트
app.post('/api/v1/users/:userId/missions', addUserMissionController)
app.patch('/api/v1/users/:userId/missions/:missionId', updateUserMissionStatusController)

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