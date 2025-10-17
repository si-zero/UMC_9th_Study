import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import { requestUserRegister } from "./controllers/user.controller.js";
import { getStoreController, createStoreController } from "./controllers/store.controller.js";
import { getReviewsController, createReviewController } from "./controllers/review.controller.js";

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

app.post("/api/user/register", requestUserRegister);

// 가게 생성 및 조회
app.post("/store", createStoreController);
app.get("/store/:id", getStoreController);

// 리뷰 생성 및 조회
app.post("/stores/:storeId/reviews", createReviewController);
app.get("/stores/:storeId/reviews", getReviewsController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});