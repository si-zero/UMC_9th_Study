import { db } from "../db.config.js"; 

// 1. 유저 미션 생성
export const createUserMission = async (userMissionData) => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO user_mission (user_id, mission_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?);`,
      [userMissionData.user_id, userMissionData.mission_id, userMissionData.status, userMissionData.created_at, userMissionData.updated_at]
    );
    return result.insertId; 
  } finally { conn.release(); }
};

// 2. 유저 미션 조회
export const findUserMissionByUserIdAndMissionId = async (user_id, mission_id) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ?;`, 
      [user_id, mission_id]
    );
    return rows.length > 0 ? rows[0] : null; 
  } finally { conn.release(); }
};

// 3. 유저 미션 상태 업데이트
export const updateUserMissionStatus = async (user_id, mission_id, new_status) => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      `UPDATE user_mission 
       SET status = ?, updated_at = ?
       WHERE user_id = ? AND mission_id = ?;`,
      [new_status, new Date(), user_id, mission_id]
    );
    return result.affectedRows; 
  } finally { conn.release(); }
};