// store.controller.js
import * as storeService from "../services/store.service.js";

// POST /store
export const createStoreController = async (req, res, next) => {
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