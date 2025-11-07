import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import { createUser, getUser } from "./controllers/user.controller.js";
import { getStoreController, createStoreController } from "./controllers/store.controller.js";
import { getReviewsController, createReviewController } from "./controllers/review.controller.js";
import { createMissionController, getMissionsController } from "./controllers/mission.controller.js";
import { addUserMissionController, updateUserMissionStatusController } from "./controllers/userMission.controller.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/users", createUser);
app.get("/api/v1/users/:user_id", getUser);

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});