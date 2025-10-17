// ✅ 1. 사용자 미션 생성 요청
export const bodyToUserMissionRequest = (body) => ({
    mission_id: body.mission_id
});

// ✅ 2. 사용자 미션 상태 업데이트
export const bodyToUserMissionUpdate = (body) => ({
    status: body.status || null // 'PROGRESS', 'COMPLETED' 등
});

// ✅ 3. 사용자 미션 응답
export const responseFromUserMission = (userMission) => ({
    user_mission_id: userMission.user_mission_id,
    user_id: userMission.user_id,
    mission_id: userMission.mission_id,
    status: userMission.status,
    created_at: userMission.created_at,
    updated_at: userMission.updated_at
});