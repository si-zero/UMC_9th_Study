import { createMission, findMissionById, findAllMissions } from "../repositories/mission.repository.js";
import { bodyToMission, responseFromMission, responseFromMissionList } from "../dtos/mission.dto.js";

// 미션 생성
export const createMissionService = async (body) => {
  
  const missionData = bodyToMission(body);
  if (!missionData.title || missionData.title.length > 20) {
      throw new Error("유효하지 않거나 너무 긴 미션 제목입니다.");
  }

  const missionId = await createMission(missionData);
  
  const newMission = await findMissionById(missionId);
  
  return responseFromMission(newMission);
};

// 미션 목록 조회
export const getMissionsService = async () => {
    
    const missionList = await findAllMissions();
    
    return responseFromMissionList(missionList);
};