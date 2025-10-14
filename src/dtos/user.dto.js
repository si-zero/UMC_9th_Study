export const bodyToUser = (body) => {
  const date = new Date(body.date); //날짜 변환

  return {
    name: body.name, // 필수
    nickname: body.nickname || body.name, // 선택
    email: body.email || "", // 선택 
    gender: body.gender, // 필수
    phoneNumber: body.phoneNumber, // 필수
    status: body.status || "미인증", // 선택
    date, // 필수
    address: body.address || "", // 선택 
    favoriteFoods: body.favoriteFoods || [], 
  };
};