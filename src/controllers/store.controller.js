// store.controller.js
import * as storeService from "../services/store.service.js";

// POST /store
export const createStoreController = async (req, res, next) => {

  /*
  #swagger.summary = '상점 리뷰 목록 조회 API';

  #swagger.responses[200] = {
    description: "상점 리뷰 목록 조회 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            // ▼▼▼ 7주차 표준 응답  ▼▼▼
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            "success": {
              type: "object",
              properties: {
                // ▼▼▼ 6주차 목록 API 구조 ▼▼▼
                "data": {
                  type: "array",
                  items: {
                    // ▼▼▼ 리뷰 '한 개'의 모양 ▼▼▼
                    type: "object",
                    properties: {
                      id: { type: "number" },
                      content: { type: "string" }
                      "items": {
                        type: "object",
                        properties: {
                          id: { type: "number" },
                          // ▼▼▼ 중첩 객체(JOIN 데이터) 마저 채우기 ▼▼▼
                          store: { type: "object", properties: { id: { type: "number" }, name: { type: "string" } } },
                          user: { type: "object", properties: { id: { type: "number" }, email: { type: "string" }, name: { type: "string" } } },
                          content: { type: "string" }
                        }
                      },
                      "pagination": {
                        type: "object",
                        // ▼▼▼ 페이지네이션 정보 채우기 ▼▼▼
                        properties: { 
                          cursor: { type: "number", nullable: true } 
                        }
                      }
                    }
                  }
                },
                "pagination": { type: "object" }
              }
            } 
          }
        }
      }
    }
  };
*/

  let newStore;
  try {
    newStore = await storeService.createStoreService(req.body);
    res.status(201).json({
      message: "가게가 성공적으로 추가되었습니다.",
      data: newStore,
    });
  } catch (err) {
    // 모든 에러 처리를 전역 미들웨어에 위임
    next(error);
  }
};

// GET /store/:id
export const getStoreController = async (req, res, next) => {
  try {
    const store = await storeService.getStoreService(req.params.id);
    res.status(200).json({
      message: "가게 조회 성공",
      data: store,
    });
  } catch (err) {
    next(err);
  }
};