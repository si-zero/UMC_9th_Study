// store.controller.js
import * as storeService from "../services/store.service.js";

// POST /store
export const createStoreController = async (req, res) => {
  let newStore;
  try {
    newStore = await storeService.createStoreService(req.body);
    res.status(201).json({
      message: "가게가 성공적으로 추가되었습니다.",
      data: newStore,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /store/:id
export const getStoreController = async (req, res) => {
  try {
    const store = await storeService.getStoreService(req.params.id);
    res.status(200).json({
      message: "가게 조회 성공",
      data: store,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};