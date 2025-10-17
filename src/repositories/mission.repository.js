import { db } from "../db.config.js"; // 가정: DB 연결 설정

// 미션 생성
export const createMission = async (missionData) => {
  const conn = await db.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO mission (title, content, reward_points, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?);`,
      [
        missionData.title,
        missionData.content,
        missionData.reward_points,
        missionData.created_at,
        missionData.updated_at
      ]
    );
    return result.insertId; // 새로 추가된 mission_id 반환

  } catch (err) {
    console.error("SQL 에러 상세:", err.sqlMessage); 
    throw new Error(`미션 추가 중 오류 발생: ${err.message}`);

  } finally {
    conn.release();
  }
};

// 미션 단일 조회
export const findMissionById = async (mission_id) => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM mission WHERE mission_id = ?;`, [mission_id]);

    if (rows.length === 0) {
      return null;
    }
    return rows[0];

  } catch (err) {
    throw new Error(`미션 단일 조회 중 오류 발생: ${err.message}`);

  } finally {
    conn.release();
  }
};

// 미션 목록 조회
export const findAllMissions = async () => {
  const conn = await db.getConnection();
  try {
    const [rows] = await conn.query(`SELECT * FROM mission ORDER BY created_at DESC;`);
    return rows; 

  } catch (err) {
    throw new Error(`미션 목록 조회 중 오류 발생: ${err.message}`);

  } finally {
    conn.release();
  }
};