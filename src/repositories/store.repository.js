import { db } from "../db.config.js";
import { prisma } from "../db.config.js";

export const createStore = async (storeData) => {
  const result = await prisma.store.create({
        data: storeData
  });
  return result;
};

// 가게 정보 얻기
export const findStoreById = async (store_id) => {
  const store = await prisma.store.findFirstOrThrow({ where: { storeId: store_id } });
  return store;
};