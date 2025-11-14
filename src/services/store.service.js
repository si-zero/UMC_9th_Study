// store.service.js
import * as StoreRepository from "../repositories/store.repository.js";
import { requestToStore, responseFromStore } from "../dtos/store.dto.js";

/**
 * 상점 생성의 비즈니스 로직을 처리하는 서비스 함수
 * @param {object} body - 클라이언트로부터 받은 요청 본문 데이터
 * @returns {Promise<object>} 생성된 상점 데이터
 */
export const createStoreService = async (body) => {
    const storeData = requestToStore(body);
    
    // 🌟 이 줄을 추가하여 regionsId가 유효한 값인지 확인하세요.
    console.log("Store Data to be created:", storeData); 

    const newStore = await StoreRepository.createStore(storeData);
    return newStore;
};

export const getStoreService = async (store_id) => {
  const store = await StoreRepository.findStoreById(store_id);
  if (!store) throw new Error("존재하지 않는 가게입니다.");
  return responseFromStore(store);
};