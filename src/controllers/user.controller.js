import { StatusCodes } from "http-status-codes";
import * as UserService from '../services/user.service.js';
import * as UserRepository from '../repositories/user.repository.js';
import { requestToUser, requestToUserPhone } from '../dtos/user.dto.js';

// ✅ 1. POST /api/v1/users (사용자 생성/회원가입)
export const createUser = async (req, res, next) => { // next 인수를 받도록 수정
    try {
        const userDTO = requestToUser(req.body);
        const userPhoneDTO = requestToUserPhone(req.body);

        const finalResponse = await UserService.userSignUp(userDTO, userPhoneDTO);

        // ✅ 성공 시: res.success() 헬퍼를 사용하는 것이 좋습니다.
        return res.status(201).success({ 
             message: "사용자 생성이 성공적으로 완료되었습니다.",
             data: finalResponse
        });

    } catch (error) {
        // 💡 모든 에러 처리를 전역 미들웨어에 위임합니다.
        // DuplicateUserEmailError 객체는 statusCode와 errorCode를 포함한 채로 전달됩니다.
        next(error); 
    }
};

// ✅ 2. GET /api/v1/users/:user_id (사용자 조회)
export const getUser = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.user_id);

        // 1. Service 로직 호출
        const finalResponse = await UserService.getUserByUserIdService(userId);
        
        // 2. 성공 응답
        return res.success({ finalResponse });

    } catch (error) {
        // 💡 모든 에러 처리를 전역 미들웨어에 위임합니다.
        // DuplicateUserEmailError 객체는 statusCode와 errorCode를 포함한 채로 전달됩니다.
        next(error); 
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
        // 💡 모든 에러 처리를 전역 미들웨어에 위임합니다.
        // DuplicateUserEmailError 객체는 statusCode와 errorCode를 포함한 채로 전달됩니다.
        next(error); 
    }
};