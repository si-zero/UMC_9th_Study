import { db } from "../db.config.js";

// 1. 사용자 전화번호 정보 생성
export const createUserPhone = async (userPhoneData) => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_phone (user_id, phone_number, status) VALUES (?, ?, ?);`,
      [userPhoneData.user_id, userPhoneData.phone_number, userPhoneData.status || 'ACTIVE']
    );
    return result.insertId;
  } finally { conn.release(); }
};

// 2. user_id로 해당 사용자의 전화번호 목록 조회
export const findUserPhoneByUserId = async (user_id) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT phone_number, status FROM user_phone WHERE user_id = ? ORDER BY status DESC;`,
      [user_id]
    );
    return rows;
  } finally { conn.release(); }
};