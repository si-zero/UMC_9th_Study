import { prisma } from "../db.config.js";

// 1. 유저 미션 생성
export const createUserMission = async (userMissionData) => {
  try {
    const newUserMission = await prisma.userMission.create({
      data: {
        // BigInt 필드는 BigInt()로 변환이 필요할 수 있습니다.
        // userMissionData에서 이미 BigInt 타입이라고 가정하고 작성합니다.
        
        // 데이터 필드명은 카멜 케이스로 매핑합니다. (스키마에 @map 설정 가정)
        userId: userMissionData.user_id, 
        missionId: userMissionData.mission_id, 
        status: userMissionData.status,
        
        // createdAt과 updatedAt은 일반적으로 Prisma가 @default(now())와 @updatedAt으로 자동 처리합니다.
        // 하지만 기존 코드처럼 명시적으로 전달해야 한다면 그대로 사용합니다.
        createdAt: userMissionData.created_at,
        updatedAt: userMissionData.updated_at,
      },
    });
    
    // 생성된 레코드의 고유 ID (userMissionId)를 반환합니다.
    return newUserMission.userMissionId; 
    
  } catch (error) {
    console.error("[Prisma Error] createUserMission:", error);
    throw error;
  }
};

// 2. 유저 미션 조회
export const findUserMissionByUserIdAndMissionId = async (userId, missionId) => {
  try {
    // findFirst는 WHERE 조건에 맞는 첫 번째 레코드를 반환하고, 없으면 null을 반환합니다.
    const userMission = await prisma.userMission.findFirst({
      where: {
        // 복합 조건 (user_id = ? AND mission_id = ?)은 ORM의 WHERE 객체로 처리합니다.
        userId: userId,
        missionId: missionId,
      },
    });
    
    // 레코드가 없으면 null을 반환하는 기존 로직과 동일합니다.
    return userMission; 
    
  } catch (error) {
    console.error("[Prisma Error] findUserMissionByUserIdAndMissionId:", error);
    throw error;
  }
};

// 3. 유저 미션 상태 업데이트
export const updateUserMissionStatus = async (userId, missionId, newStatus) => {
  try {
    const result = await prisma.userMission.updateMany({
      // 갱신할 레코드 조건 (WHERE user_id = ? AND mission_id = ?)
      where: {
        userId: userId,
        missionId: missionId,
      },
      // 갱신할 데이터 (SET status = ?, updated_at = ?)
      data: {
        status: newStatus,
        // updatedAt은 @updatedAt 설정으로 자동 처리되지만, 명시적으로 new Date()를 사용한다면 그대로 둡니다.
        updatedAt: new Date(),
      },
    });
    
    // 업데이트된 레코드 수 (affectedRows)를 반환합니다.
    return result.count; 
    
  } catch (error) {
    console.error("[Prisma Error] updateUserMissionStatus:", error);
    throw error;
  }
};