import * as UserRepository from '../repositories/user.repository.js';
// import { responseFromUser } from "../dtos/user.dto.js";

export const userSignUp = async (data) => {
  const userDataToCreate = {
    // 필수 필드
    password: data.password, 
    email: data.email, 
    
    // 선택 및 기본값 필드
    name: data.name, 
    nickname: data.nickname || data.name,
    role: 'USER',
    gender: data.gender,
    date: data.date, 
    address: data.address || "", 
    point: 0, 

    created_at: new Date(),
    updated_at: new Date()
  };

  if (!userDataToCreate.email || !userDataToCreate.password) {
      throw new Error("이메일과 비밀번호는 필수 입력 항목입니다.");
  }
  
  if (await UserRepository.findUserByEmail(userDataToCreate.email)) {
    throw new Error("이미 존재하는 이메일입니다.");
  }
  
  let joinUserId;
  try {
    joinUserId = await UserRepository.createUser(userDataToCreate);
  } catch (error) {
    console.error("사용자 생성 중 DB 오류 발생:", error);
    throw new Error("회원가입에 실패했습니다. (DB 오류)");
  }

  const user = await UserRepository.findUserById(joinUserId);
  
  return responseFromUser(user); 
};