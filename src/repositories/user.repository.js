import { pool } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
      data.email
    );

    if (confirm[0].isExistEmail) {
      return null;
    }

    const [result] = await pool.query(
      `INSERT INTO user (name, nickname, email, role, point, gender, phone_number, date, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.name,
        data.nickname,
        data.email,
        data.role,
        data.point,
        data.gender,
        data.phoneNumber,
        data.date,
        data.address,
        data.phoneNumber,
        data.status,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE id = ?;`, userId);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 음식 선호 카테고리 매핑
export const setFavoriteId = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO favorite_food (category_id, user_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 반환
export const getUserFavoriteFoodByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      "SELECT ufc.id, ufc.food_category_id, ufc.user_id, fcl.name " +
        "FROM user_favor_category ufc JOIN food_category fcl on ufc.food_category_id = fcl.id " +
        "WHERE ufc.user_id = ? ORDER BY ufc.food_category_id ASC;",
      userId
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
