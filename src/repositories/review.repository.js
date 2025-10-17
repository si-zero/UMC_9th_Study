import { db } from "../db.config.js";

// 리뷰 생성
export const createReview = async (reviewData) => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO review (user_id, store_id, title, content, asterion, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        reviewData.user_id,
        reviewData.store_id,
        reviewData.title,
        reviewData.content,
        reviewData.asterion,
        reviewData.created_at,
        reviewData.updated_at
      ]
    );
    return result.insertId; // 새로 추가된 review_id 반환

  } catch (err) {
    console.error("SQL 에러 상세:", err.sqlMessage); 
    throw new Error(`리뷰 추가 중 오류 발생: ${err.message}`);

  } finally {
    conn.release();
  }
};

// 리뷰 단일 조회
export const findReviewById = async (review_id) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM review WHERE review_id = ?;`, [review_id]);

    if (rows.length === 0) {
      return null; // 쿼리문을 통해 가져온 데이터가 없다면 'null' 반환
    }
    return rows[0];

  } catch (err) {
    throw new Error(`리뷰 조회 중 오류 발생: ${err.message}`);

  } finally {
    conn.release();
  }
};

// 리뷰 목록 조회
export const findReviewsByStoreId = async (store_id) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM review WHERE store_id = ? ORDER BY created_at DESC;`, [store_id]);
    return rows; 

  } catch (err) {
    throw new Error(`가게 리뷰 목록 조회 중 오류 발생: ${err.message}`);

  } finally {
    conn.release();
  }
};