// user/services/user.service.js

import * as UserRepository from '../repositories/user.repository.js';
import * as UserPhoneRepository from '../repositories/userPhone.repository.js'; // user_phone 레포지토리 추가
import { responseFromUser } from "../dtos/user.dto.js"; // DTO import
import bcrypt from 'bcrypt';
/**
 * 💡 수정된 userSignUp (Service)
 * Controller에서 분리된 DTO를 인자로 받음으로써 Service의 관심사를 명확히 합니다.
 * @param {object} userDTO - user 테이블 데이터
 * @param {object|null} userPhoneDTO - user_phone 테이블 데이터 (null 가능)
 */

const saltRounds = 10;

export const userSignUp = async (userDTO, userPhoneDTO) => {
  // 1. 비즈니스 유효성 검사 (DTO에서 넘어온 데이터 사용)
  if (!userDTO.email || !userDTO.password) {
      // Controller에서 DTO 변환 시 처리할 수도 있으나, Service에서 한 번 더 검증
      throw new Error("이메일과 비밀번호는 필수 입력 항목입니다.");
  }
  
  // 2. 비즈니스 로직: 중복 확인
  if (await UserRepository.findUserByEmail(userDTO.email)) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  const hashedPassword = await bcrypt.hash(userDTO.password, saltRounds);
  userDTO.password = hashedPassword;  

  // 3. 데이터 가공 및 날짜 설정 (DB 저장을 위한 최종 데이터 준비)
  const now = new Date();
  const userDataToCreate = {
    ...userDTO, // Controller에서 이미 password, email 등을 가지고 넘어옴
    role: userDTO.role || 'USER', 
    point: userDTO.point || 0,
    // password는 Controller에서 해싱되었거나, 여기서 해싱 로직이 추가되어야 함
  };
  
  // 4. 트랜잭션 시작 (User 생성 후 Phone 생성)
  let joinUserId;
  let userPhoneRecords = [];
  
  try {
    // 4-1. User 생성 (첫 번째 Repository 호출)
    joinUserId = await UserRepository.createUser(userDataToCreate);

    // 4-2. User Phone 생성 (두 번째 Repository 호출, 데이터가 있을 경우만)
    if (userPhoneDTO) {
        const userPhoneData = {
            user_id: joinUserId, // 생성된 User ID를 외래 키로 주입
            phone_number: userPhoneDTO.phoneNumber,
            status: userPhoneDTO.status
        };
        await UserPhoneRepository.createUserPhone(userPhoneData);
        userPhoneRecords = [userPhoneData]; // 응답을 위해 저장
    }

  } catch (error) {
    console.error("사용자 생성 트랜잭션 중 DB 오류 발생:", error);
    throw new Error("회원가입에 실패했습니다. (DB 오류)");
  }

  // 5. 생성된 User 정보 조회 및 응답
  const user = await UserRepository.findUserById(joinUserId);
  
  // 6. 응답 DTO 변환
  // user와 userPhone 정보를 함께 DTO로 변환하여 Controller에 반환
  return responseFromUser(user, userPhoneRecords.length > 0 ? userPhoneRecords[0] : null); 
};

// 💡 사용자 로그인 검증 서비스
export const userLogin = async (email, password) => {
    // 1. 이메일로 사용자 정보 조회 (DB에 저장된 해시 값 가져오기)
    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
        throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    // 2. 비밀번호 검증 (핵심)
    // bcrypt.compare(평문 비밀번호, 저장된 해시 값)
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    // 3. 검증 성공, 로그인 처리 (세션/토큰 생성 등)
    return user; 
};

export const getUserByUserIdService = async (user_id) => {
    const user = await UserRepository.findUserById(user_id);

    return user;
}

export const getUserByEmailService = async (email) => {
    const user = await UserRepository.findUserByEmail(email);

    return user;
}