//import { responseFromUser } from "../dtos/user.dto.js";
import { addUser, getUser, getUserFavoriteFoodByUserId, setFavoriteId, } from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    name: data.name, // "유시영"
    nickname: data.nickname || data.name, // "벡스" 또는 "유시영"
    email: data.email || "", // "snm306@naver.com" 또는 ""
    gender: data.gender, // "남"
    phoneNumber: data.phoneNumber, // "010-1234-1234"
    status: data.status || "미인증", // "미인증"
    date: data.date, // "2003-06-11"
    address: data.address || "", // "경기도 고리울로39번길 4"
    favorite_id: data.favorite_id || [] // [1, 2] 또는 []
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const favorite_id of data.favorite_id) {
    await setFavoriteId(joinUserId, favorite_id);
  }

  const user = await getUser(joinUserId);
  const favorite_food = await getUserFavoriteFoodByUserId(joinUserId);
  return responseFromUser({ user, favorite_id });
};