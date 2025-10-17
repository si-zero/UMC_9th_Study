import { db } from "../db.config.js";

export const createStore = async (storeData) => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO store (regions_id, name, lat, lng, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        storeData.regions_id,
        storeData.name,
        storeData.lat,
        storeData.lng,
        storeData.created_at,
        storeData.updated_at
      ]
    );

    return result.insertId; // 새로 추가된 store_id 반환

  } catch (err) {

    throw new Error(`가게 추가 중 오류 발생: ${err}`);

  } finally {

    conn.release();

  }
};

// 가게 정보 얻기
export const findStoreById = async (store_id) => {
  const conn = await db.getConnection();

  try {
    const [store] = await conn.query(`SELECT * FROM store WHERE store_id = ?;`, store_id);

    console.log(store);

    if (store.length == 0) {
      return null;
    }

    return store;

  } catch (err) {

    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );

  } finally {

    conn.release();

  }
};