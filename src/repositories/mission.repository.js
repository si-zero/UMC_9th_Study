import { db } from "../db.config.js"; // 가정: DB 연결 설정
import { prisma } from "../db.config.js";

// 미션 생성
export const createMission = async (missionData) => {
  const result = await prisma.mission.create({
    data: missionData
  })
};

// 미션 단일 조회
export const findMissionById = async (mission_id) => {
  let mission;
  try {
    mission = await prisma.mission.findFirstOrThrow({ where: { missionId: mission_id } });
    return mission;
  } catch (err) {
    console.log(mission);
    console.log(err);
  }
  
};

// 미션 목록 조회
export const findAllMissions = async () => {
  try {
    const missions = await prisma.mission.findMany({
      // 1. 모든 미션 레코드를 찾습니다 (SELECT * FROM mission)
      
      // 2. 정렬 순서를 지정합니다 (ORDER BY created_at DESC)
      orderBy: {
        createdAt: 'desc', // 스키마에 정의된 카멜 케이스 필드명 사용
      },
      
    });
    
    // 3. 조회된 미션 목록 (배열) 반환
    return missions; 

  } catch (error) {
    console.error("[Prisma Repository Error] findAllMissions:", error);
    
    throw new Error("미션 목록을 조회하는 중 오류가 발생했습니다.");
  }
};