// ✅ 1-1. 사용자 생성 요청

export const requestToUser = (body) => {
  const date = new Date(body.date); //날짜 변환

  return {
    // 필수
    name: body.name,
    password: body.password,
    email: body.email,
    gender: body.gender,
    date,

    // 선택
    nickname: body.nickname || body.name,
    point: body.point || 0,
    role: body.role || 'USER', // 기본값 설정
    address: body.address || "",
  };
};

// ✅ 1-2. 사용자 전화번호 요청
export const requestToUserPhone = (body) => ({
    phoneNumber: body.phoneNumber || null, 
    status: 'ACTIVE'
});

// ✅ 3. 사용자 응답: responseFromUser
export const responseFromUser = (user, userPhone = null) => ({
    user_id: user.user_id,
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    point: user.point,
    gender: user.gender,
    date: user.date,
    address: user.address,
    phoneNumber: userPhone ? userPhone.phone_number : null,
    
    created_at: user.created_at,
    updated_at: user.updated_at
});