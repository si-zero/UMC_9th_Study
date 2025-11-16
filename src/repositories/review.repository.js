import { db } from "../db.config.js";
import { prisma } from "../db.config.js";

export const getAllStoreReviews = async (storeId) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: { id: true, content: true, store: true, user: true },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};

// 리뷰 생성
export const createReview = async (reviewData) => {
  const review = await prisma.review.create ({
    data: reviewData
  })
  return review;
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
export const findReviewsByStoreId = async (storeId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        storeId: BigInt(storeId)
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return reviews;

  } catch (err) {
    throw new Error(`가게 리뷰 목록 조회 중 오류 발생: ${err.message}`);
  }
};
