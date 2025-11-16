import * as reviewService from "../services/review.service.js";

// POST /stores/:storeId/reviews
// 리뷰 생성
export const createReviewController = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    
    const reviewBody = { ...req.body, store_id: storeId };
    const newReview = await reviewService.createReviewService(reviewBody);
    
    res.status(201).json({
      message: "리뷰가 성공적으로 작성되었습니다.",
      data: newReview,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "리뷰 작성 중 서버 오류가 발생했습니다." });
  }
};

// GET /stores/:storeId/reviews
// 특정 가게 리뷰 목록 조회
export const getReviewsController = async (req, res) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    
    const reviewList = await reviewService.getReviewsByStoreIdService(storeId);
    
    res.status(200).json({
      message: "리뷰 목록 조회 성공",
      data: reviewList,
    });

  } catch (err) {
    if (err.message.includes("존재하지 않는 가게")) {
        return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "리뷰 목록 조회 중 서버 오류가 발생했습니다." });
  }
};

// GET /api/v1/stores/:storeId/reviews
// 특정 가게 리뷰 목록 조회
export const getStoreReviewsListController = async (req, res, next) => {
  const reviews = await listStoreReviews(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).json(reviews);
};