import { StatusCodes } from "http-status-codes";
import * as UserService from '../services/user.service.js';
import * as UserRepository from '../repositories/user.repository.js';
import { requestToUser, requestToUserPhone } from '../dtos/user.dto.js';

// ✅ 1. POST /api/v1/users (사용자 생성/회원가입)
export const createUser = async (req, res) => {
    try {
        // 1. DTO 변환 및 데이터 분리 (생략 가능)
        const userDTO = requestToUser(req.body);
        const userPhoneDTO = requestToUserPhone(req.body);

        // 2. Service 로직 호출
        // finalResponse는 생성된 사용자 객체를 담고 있습니다.
        const finalResponse = await UserService.userSignUp(userDTO, userPhoneDTO);

        // 3. 응답 (수정됨: 201 Created 사용 및 변수명 수정)
        // 응답 코드를 201(Created)로 변경하고, 정의된 변수 finalResponse를 사용합니다.
        // *주의: .success()는 프레임워크에 정의된 커스텀 함수일 수 있습니다.
        //          표준 Express 응답은 .send()나 .json()입니다.
        res.status(201).json({
            message: "사용자 생성이 성공적으로 완료되었습니다.",
            data: finalResponse
        });

    } catch (error) {
        // 4. 에러 처리 (Service에서 던져진 에러를 HTTP 상태 코드로 변환)
        
        // 에러를 좀 더 체계적으로 분류
        if (error.message.includes("필수")) {
             return res.status(400).json({ message: "요청 데이터 오류: " + error.message }); // Bad Request
        }
        if (error.message.includes("사용 중인 이메일")) {
             return res.status(409).json({ message: error.message }); // Conflict (자원 충돌)
        }
        
        // 그 외 예상치 못한 모든 서버 오류
        return res.status(500).json({ 
            message: "서버 오류로 인해 사용자 생성에 실패했습니다.", 
            error: error.message 
        });
    }
};

// ✅ 2. GET /api/v1/users/:user_id (사용자 조회)
export const getUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.user_id);

        // 1. Service 로직 호출
        const finalResponse = await UserService.getUserByUserIdService(userId);
        
        // 2. 성공 응답
        return res.status(200).json(finalResponse);

    } catch (error) {
        // 3. 에러 처리
        if (error.message.includes("존재하지 않는 사용자")) {
            return res.status(404).json({ message: error.message }); // Not Found
        }
        return res.status(500).json({ message: "Server error during fetching user data.", error: error.message });
    }
};

export const getUserByEmail = async (req, res) => {
    try {
        // 🚨 핵심: req.query 객체에서 'email' 키의 값을 추출합니다.
        const email = req.query.email; 

        if (!email) {
            return res.status(400).json({ message: "Email 쿼리 파라미터가 필요합니다." });
        }
        
        // Repository 함수 호출: 추출한 email 값을 함수의 파라미터로 전달
        const user = await UserRepository.findUserByEmail(email); 

        return res.status(200).json({
            message: "사용자 정보 조회 성공",
            user: user
        });

    } catch (error) {
        // Prisma.findFirstOrThrow()는 데이터가 없을 경우 에러를 던집니다.
        // 예외 처리 로직 추가 필요
        console.error(error);
        return res.status(500).json({ 
            message: "사용자 조회 중 서버 오류 발생", 
            error: error.message 
        });
    }
};