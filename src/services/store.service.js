// store.service.js
import { createStore, findStoreById } from "../repositories/store.repository.js";
import { bodyToStore, responseFromStore } from "../dtos/store.dto.js";

export const createStoreService = async (body) => {
  const storeData = bodyToStore(body);
  const storeId = await createStore(storeData);
  const store = await findStoreById(storeId);
  const responseData = responseFromStore(store[0]); 
  return responseData;
};

export const getStoreService = async (store_id) => {
  const store = await findStoreById(store_id);
  if (!store) throw new Error("존재하지 않는 가게입니다.");
  return responseFromStore(store[0]);
};