import * as userMissionService from "../services/userMission.service.js";

// POST /users/:userId/missions
// 사용자 미션 할당
export const addUserMissionController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const newUserMission = await userMissionService.addUserMissionService(userId, req.body);
    res.status(201).json({ message: "미션 할당 성공", data: newUserMission });
  } catch (err) {
    let status = 500;
    if (err.message.includes("존재하지 않는")) status = 404;
    else if (err.message.includes("이미 할당된")) status = 409;
    res.status(status).json({ error: err.message });
  }
};

// PATCH /users/:userId/missions/:missionId
// 2. 사용자 미션 상태 업데이트
export const updateUserMissionStatusController = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const missionId = parseInt(req.params.missionId, 10);
    const updatedUserMission = await userMissionService.updateUserMissionStatusService(userId, missionId, req.body);
    res.status(200).json({ message: "미션 상태 업데이트 성공", data: updatedUserMission });
  } catch (err) {
    let status = 500;
    if (err.message.includes("유효하지 않은")) status = 400;
    else if (err.message.includes("존재하지 않습니다")) status = 404;
    res.status(status).json({ error: err.message });
  }
};