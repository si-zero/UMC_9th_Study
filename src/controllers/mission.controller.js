import * as missionService from "../services/mission.service.js";

// POST /missions
// 미션 생성
export const createMissionController = async (req, res) => {
  try {
    const newMission = await missionService.createMissionService(req.body);
    
    res.status(201).json({
      message: "미션이 성공적으로 생성되었습니다.",
      data: newMission,
    });
  } catch (err) {
    if (err.message.includes("유효하지 않거나")) {
        // 유효성 검사 실패
        return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "미션 생성 중 서버 오류가 발생했습니다." });
    console.log(err);
  }
};

// GET /mission/:missionId
// 미션 단일 조회
export const getMissionByMissionIdController = async (req, res) => {
  try {

    const mission = await missionService.getMissionByMissionIdService(req.params.missionId);
    res.status(200).json({
      message: "미션 조회 성공",
      data: mission,
    });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

// GET /missions
// 미션 목록 조회
export const getMissionsController = async (req, res) => {
  try {
    const missionList = await missionService.getMissionsService();
    
    res.status(200).json({
      message: "미션 목록 조회 성공",
      data: missionList,
    });

  } catch (err) {
    res.status(500).json({ error: "미션 목록 조회 중 서버 오류가 발생했습니다." });
  }
};