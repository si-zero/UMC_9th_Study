import { createMission, findMissionById, findAllMissions } from "../repositories/mission.repository.js";
import { bodyToMission, responseFromMission, responseFromMissionList } from "../dtos/mission.dto.js";

// 미션 생성
export const createMissionService = async (body) => {
  
  const missionData = bodyToMission(body);
  if (!missionData.title || missionData.title.length > 20) {
      throw new Error("유효하지 않거나 너무 긴 미션 제목입니다.");
  }
  return missionData;
};

// 미션 단일 조회
export const getMissionByMissionIdService = async (mission_id) => {
  const mission = await findMissionById(mission_id);

  if (!mission) throw new Error("존재하지 않는 미션입니다.");
  return responseFromMission(mission);
}

// 미션 목록 조회
export const getMissionsService = async () => {
    
    const missionList = await findAllMissions();
    
    return responseFromMissionList(missionList);
};