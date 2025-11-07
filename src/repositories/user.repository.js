import { db } from "../db.config.js";

// 1. 유저 생성
export const createUser = async (userData) => {
  const conn = await db.getConnection();
  try {
    // DB의 created_at, updated_at 필드는 보통 DB DEFAULT나 Service에서 처리합니다.
    // 여기서는 Service에서 날짜를 넘겨준다고 가정하고 코드를 작성합니다.
    const [result] = await conn.query(
      `INSERT INTO user (name, nickname, email, password, role, gender, date, address, point, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        userData.name, 
        userData.nickname, 
        userData.email, 
        userData.password, // Service 레이어에서 이미 해싱된 값
        userData.role || 'USER', 
        userData.gender, 
        userData.date, 
        userData.address,
        userData.point || 0, // 기본 포인트 0
        userData.created_at, 
        userData.updated_at
      ]
    );
    // 생성된 유저의 user_id를 반환
    return result.insertId; 
  } finally { 
    conn.release(); 
  }
};

// 2-1. 유저 조회 (user_id)
export const findUserById = async (user_id) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM user WHERE user_id = ?;`, 
      [user_id]
    );
    return rows.length > 0 ? rows[0] : null; 
  } finally { 
    conn.release(); 
  }
};

// 2-2. 유저 조회 (email)
export const findUserByEmail = async (user_id) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM user WHERE email = ?;`, 
      [email]
    );
    return rows.length > 0 ? rows[0] : null; 
  } finally { 
    conn.release(); 
  }
};

// 3. 포인트 업데이트
export const updateUserPoint = async (user_id, point_change) => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      `UPDATE user 
       SET point = point + ?, updated_at = ?
       WHERE user_id = ?;`,
      [point_change, new Date(), user_id]
    );
    return result.affectedRows;
  } finally { 
    conn.release(); 
  }
};