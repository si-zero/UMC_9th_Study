import { createUserMission, findUserMissionByUserIdAndMissionId, updateUserMissionStatus } from "../repositories/userMission.repository.js";
import { findUserById } from "../repositories/user.repository.js";
import { findMissionById } from "../repositories/mission.repository.js"; 
import { bodyToUserMissionRequest, bodyToUserMissionUpdate, responseFromUserMission } from "../dtos/userMission.dto.js";

// 1. 사용자 미션 할당
export const addUserMissionService = async (userId, requestBody) => {
  const { mission_id } = bodyToUserMissionRequest(requestBody);
  
  if (!await findUserById(userId)) throw new Error(`존재하지 않는 사용자입니다. (ID: ${userId})`);
  if (!await findMissionById(mission_id)) throw new Error(`존재하지 않는 미션입니다. (ID: ${mission_id})`);
  if (await findUserMissionByUserIdAndMissionId(userId, mission_id)) throw new Error("이미 할당된 미션입니다.");

  const userMissionData = { user_id: userId, mission_id, status: 'START', created_at: new Date(), updated_at: new Date() };
  const userMissionId = await createUserMission(userMissionData);
  const newUserMission = await findUserMissionByUserIdAndMissionId(userId, mission_id); // 생성된 레코드 재조회

  return responseFromUserMission(newUserMission);
};

// 2. 사용자 미션 상태 업데이트
export const updateUserMissionStatusService = async (userId, missionId, requestBody) => {
  const { status: newStatus } = bodyToUserMissionUpdate(requestBody);
  
  if (!['PROGRESS', 'COMPLETED', 'FAILED'].includes(newStatus)) throw new Error("유효하지 않은 미션 상태 값입니다.");
  const existingUserMission = await findUserMissionByUserIdAndMissionId(userId, missionId);
  if (!existingUserMission) throw new Error(`할당된 미션이 존재하지 않습니다.`);

  const affectedRows = await updateUserMissionStatus(userId, missionId, newStatus);
  if (affectedRows === 0) throw new Error("미션 상태 업데이트 실패."); 

  const updatedUserMission = await findUserMissionByUserIdAndMissionId(userId, missionId); 
  return responseFromUserMission(updatedUserMission);
};