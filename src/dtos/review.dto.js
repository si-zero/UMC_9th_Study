// ✅ 1. 리뷰 생성
export const bodyToReview = (body) => {
  return {
    user_id: body.user_id,
    store_id: body.store_id,
    title: body.title || null, // VARCHAR(10)
    content: body.content || null, // VARCHAR(50)
    asterion: body.asterion || null, // FLOAT (별점)
    created_at: new Date(),
    updated_at: new Date()
  };
};

// ✅ 2. 리뷰 단일 조회
export const responseFromReview = (review) => {
  return {
    review_id: review.review_id,
    user_id: review.user_id,
    store_id: review.store_id,
    title: review.title,
    content: review.content,
    rating: review.asterion, // 'asterion'을 'rating'으로 변경하여 반환
    created_at: review.created_at,
    updated_at: review.updated_at
  };
};

// ✅ 3. 리뷰 목록 조회
export const responseFromReviewList = (reviewList) => {
  if (!Array.isArray(reviewList)) {
    return [];
  }
  // 각 배열을 모두 순회하여 배열값마다 responseFromReview 적용
  return reviewList.map(review => responseFromReview(review)).filter(r => r !== null);
};

export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};