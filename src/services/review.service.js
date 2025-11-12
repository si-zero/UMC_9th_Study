import { createReview, findReviewById, findReviewsByStoreId } from "../repositories/review.repository.js";
import { bodyToReview, responseFromReview, responseFromReviewList } from "../dtos/review.dto.js";
import { findStoreById } from "../repositories/store.repository.js"; 

// 리뷰 생성 및 조회
export const createReviewService = async (body) => {
  const reviewData = bodyToReview(body);
  const store = await findStoreById(reviewData.store_id);
  if (!store) throw new Error("존재하지 않는 가게에는 리뷰를 작성할 수 없습니다.");

  const reviewId = await createReview(reviewData);
  
  const newReview = await findReviewById(reviewId);
  
  return responseFromReview(newReview);
};

// 가게 ID를 이용해 리뷰 목록 조회
export const getReviewsByStoreIdService = async (store_id) => {
    if (isNaN(store_id) || store_id <= 0) {
        throw new Error("유효하지 않은 가게 ID입니다.");
    }
    
    const store = await findStoreById(store_id);
    if (!store) throw new Error("존재하지 않는 가게입니다.");

    const reviewList = await findReviewsByStoreId(store_id);
    
    return responseFromReviewList(reviewList);
};

// repository 호출 및 DTO 변환 후 반환
export const listStoreReviews = async (storeId) => {
  const reviews = await getAllStoreReviews(storeId);
  return responseFromReviews(reviews);
};