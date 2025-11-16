// ✅ 1. 미션 생성
export const bodyToMission = (body) => {
  return {
    title: body.title || null,    // VARCHAR(20)
    content: body.content || null,  // VARCHAR(50)
    rewardPoints: body.reward_points || 0, // INT
  };
};

// ✅ 2. 미션 단일 조회
export const responseFromMission = (mission) => {
  return {
    mission_id: mission.mission_id,
    title: mission.title,
    content: mission.content,
    reward_points: mission.reward_points,
    created_at: mission.created_at,
    updated_at: mission.updated_at
  };
};

// ✅ 3. 미션 목록 조회
export const responseFromMissionList = (missionList) => {
  if (!Array.isArray(missionList)) {
    return [];
  }
  // 각 배열을 순회하여 responseFromMission 적용
  return missionList.map(mission => responseFromMission(mission)).filter(m => m !== null);
};