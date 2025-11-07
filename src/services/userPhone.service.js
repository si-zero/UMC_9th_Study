import * as UserRepository from '../repositories/user.repository.js';
import * as UserPhoneRepository from '../repositories/userPhone.repository.js';
import { responseFromUser } from '../dtos/user.dto.js'; 

// 1. 사용자 생성/회원가입
export const registerUserService = async (userDTO, userPhoneDTO) => {
    // 1. 비즈니스 유효성 검사
    if (!userDTO.email || !userDTO.password) throw new Error("이메일과 비밀번호는 필수입니다.");
    
    // 이메일 중복 확인
    if (await UserRepository.findUserByEmail(userDTO.email)) throw new Error("이미 사용 중인 이메일입니다.");
    
    const now = new Date();
    const userDataToCreate = {
        ...userDTO,
        created_at: now,
        updated_at: now,
        point: userDTO.point || 0
    };
    
    // 3. User, User_Phone 순차 저장
    try {
        const newUserId = await UserRepository.createUser(userDataToCreate); // User 저장
        let newUserPhoneRecords = [];

        if (userPhoneDTO) {
            const userPhoneData = {
                user_id: newUserId,
                phone_number: userPhoneDTO.phone_number,
                status: userPhoneDTO.status
            };
            await UserPhoneRepository.createUserPhone(userPhoneData); // User_Phone 저장
            newUserPhoneRecords = [userPhoneData];
        }
        
        // 4. 응답 형식 변환을 위해 생성된 유저 재조회
        const newUser = await UserRepository.findUserById(newUserId);
        
        return responseFromUser(newUser, newUserPhoneRecords);

    } catch (error) {
        console.error("사용자 생성 트랜잭션 실패:", error);
        throw new Error("회원가입 중 서버 에러가 발생했습니다.");
    }
};

// 2. 사용자 프로필 상세 조회 서비스
export const getUserProfileService = async (userId) => {
    const user = await UserRepository.findUserById(userId);
    if (!user) throw new Error(`존재하지 않는 사용자입니다. (ID: ${userId})`);
    
    const phoneRecords = await UserPhoneRepository.findUserPhoneByUserId(userId);
    return responseFromUser(user, phoneRecords);
};