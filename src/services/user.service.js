// user/services/user.service.js

import * as UserRepository from '../repositories/user.repository.js';
import * as UserPhoneRepository from '../repositories/userPhone.repository.js';
import { responseFromUser } from "../dtos/user.dto.js"; 
import bcrypt from 'bcrypt';
import { prisma } from "../db.config.js"; 

// ✅ 커스텀 에러 핸들링 (경로는 실제 파일 위치에 맞게 수정해주세요)
import { 
    DuplicateUserEmailError, 
    MissingRequiredFieldError, 
    AuthenticationFailedError,
    ResourceNotFoundError, // 사용자 조회 실패 시 사용
    TransactionFailedError // DB 트랜잭션 실패 시 사용
} from "../errors.js"; 

const saltRounds = 10;

// ----------------------------------------------------------------------
// 1. 사용자 회원가입
// ----------------------------------------------------------------------
export const userSignUp = async (userDTO, userPhoneDTO) => {
  
  // 1. 비즈니스 유효성 검사 (MissingRequiredFieldError 사용)
  if (!userDTO.email || !userDTO.password) {
      // MissingRequiredFieldError는 statusCode 400을 가집니다.
      throw new MissingRequiredFieldError("이메일과 비밀번호는 필수 입력 항목입니다.", userDTO);
  }
  
  // 2. 비즈니스 로직: 중복 확인 (DuplicateUserEmailError 사용)
  const existingUser = await UserRepository.findUserByEmail(userDTO.email);
  if (existingUser) {
    // DuplicateUserEmailError는 statusCode 409를 가집니다.
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", userDTO);
  }

  const hashedPassword = await bcrypt.hash(userDTO.password, saltRounds);
  userDTO.password = hashedPassword;  

  const userDataToCreate = { 
    ...userDTO, 
    role: userDTO.role || 'USER', 
    point: userDTO.point || 0 
  };
  
  // 4. 트랜잭션 시작
  let transactionResult;
  try {
    transactionResult = await prisma.$transaction(async (tx) => {
        
        const createdUser = await tx.user.create({ data: userDataToCreate });
        const joinUserId = createdUser.userId;

        let createdPhone = null;
        if (userPhoneDTO) {
            const userPhoneData = {
                userId: joinUserId, 
                phoneNumber: userPhoneDTO.phoneNumber,
                status: userPhoneDTO.status
            };
            // 💡 tx 객체를 직접 사용하여 트랜잭션 내부에서 DB 작업 수행
            createdPhone = await tx.userPhone.create({ data: userPhoneData }); 
        }

        return { user: createdUser, phone: createdPhone };
    }); 
    
  } catch (error) {
    // 💡 DB 오류 발생 시, TransactionFailedError (statusCode 500)를 던져 시스템 오류임을 알림
    console.error("사용자 생성 트랜잭션 중 DB 오류 발생:", error);
    throw new TransactionFailedError("회원가입 트랜잭션 처리 중 오류가 발생했습니다.");
  }

  // 5. 응답 DTO 변환
  return responseFromUser(transactionResult.user, transactionResult.phone); 
};

// ----------------------------------------------------------------------
// 2. 사용자 로그인 검증
// ----------------------------------------------------------------------
export const userLogin = async (email, password) => {
    // 1. 이메일로 사용자 정보 조회
    const user = await UserRepository.findUserByEmail(email);

    // 💡 user가 없으면, AuthenticationFailedError를 던집니다.
    if (!user) {
        // AuthenticationFailedError는 statusCode 401을 가집니다.
        throw new AuthenticationFailedError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    // 2. 비밀번호 검증
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    // 💡 비밀번호가 일치하지 않으면, AuthenticationFailedError를 던집니다.
    if (!isPasswordMatch) {
        // AuthenticationFailedError는 statusCode 401을 가집니다.
        throw new AuthenticationFailedError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }

    // 3. 검증 성공
    return user; 
};

// ----------------------------------------------------------------------
// 3. 사용자 ID로 조회
// ----------------------------------------------------------------------
export const getUserByUserIdService = async (user_id) => {
    const user = await UserRepository.findUserById(user_id);
    
    // 💡 유저가 없으면, ResourceNotFoundError를 던집니다.
    if (!user) {
        console.log("오류");
        // ResourceNotFoundError는 statusCode 404를 가집니다.
        throw new ResourceNotFoundError(`사용자 ID ${user_id}를 찾을 수 없습니다.`, user_id);
    }

    return user;
}

// ----------------------------------------------------------------------
// 4. 사용자 이메일로 조회
// ----------------------------------------------------------------------
export const getUserByEmailService = async (email) => {
    const user = await UserRepository.findUserByEmail(email);
    
    // 💡 유저가 없으면, ResourceNotFoundError를 던집니다.
    if (!user) {
        throw new ResourceNotFoundError(`이메일 ${email}에 해당하는 사용자를 찾을 수 없습니다.`);
    }

    return user;
}