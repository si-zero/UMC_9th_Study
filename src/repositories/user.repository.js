import { db } from "../db.config.js";
import { prisma } from "../db.config.js";

// 1. 유저 생성
export const createUser = async (userData) => {
  console.log('Received userData:', userData); // <-- 이 로그를 추가하여 user_id 필드 유무 및 값 확인
  const { user_id, ...dataToCreate } = userData;
  console.log('Data to be created:', dataToCreate);

  const user = await prisma.user.findFirst({
    where: { email: dataToCreate.email }
  });

  if (user) {
    return null;
  }

  const created = await prisma.user.create({ data: dataToCreate });
  return created.user_id;

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
export const findUserByEmail = async (email) => {
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