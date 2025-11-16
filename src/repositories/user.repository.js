// user.repository.js (수정됨)
// 💡 db import 제거

import { prisma } from "../db.config.js";

// 1. 유저 생성 (단순 CRUD)
export const createUser = async (data) => {
  // 중복 검사 로직 제거, 오직 생성만 담당
  const created = await prisma.user.create({ data: data });
  // BigInt를 처리하는 .toJSON()이 있으므로, 객체 자체를 반환해도 됨
  return created; 
};

// 2-1. 유저 조회 (user_id)
export const findUserById = async (user_id) => {
  // 💡 await 추가 및 findFirstOrThrow 대신 findFirst 사용
  const user = await prisma.user.findFirst({ 
    where: { userId: BigInt(user_id) } // BigInt 변환 (Controller에서 문자열로 넘어왔다면)
  });
  return user; // 없으면 null 반환
};

// 2-2. 유저 조회 (email)
export const findUserByEmail = async (email) => {
  // 💡 await 추가 및 findFirstOrThrow 대신 findFirst 사용
  const user = await prisma.user.findFirst({ where: { email: email } });
  return user; // 없으면 null 반환
};

// 3. 포은티 업데아트
/**
 * 사용자 포인트를 특정 값만큼 증가 또는 감소시킵니다.
 * @param {bigint} userId - 업데이트할 사용자의 ID (Prisma 모델에 맞춰 camelCase 사용)
 * @param {number} pointChange - 포인트 변경량 (양수: 증가, 음수: 감소)
 * @returns {number} - 업데이트된 행의 수 (1 또는 0)
 */
export const updateUserPoint = async (userId, pointChange) => {
  // 💡 Prisma의 update 메서드를 사용합니다.
  const result = await prisma.user.update({
    where: {
      // DB 컬럼명이 user_id라도, Prisma 모델명인 userId를 사용합니다.
      userId: userId, 
    },
    data: {
      // 💡 포인트 필드에 'increment' 연산자를 사용하여 값을 더합니다.
      point: {
        increment: pointChange,
      },
      // updated_at 필드는 스키마에 @updatedAt이 설정되어 있으면 자동으로 업데이트됩니다.
      // 수동으로 값을 지정할 필요가 없습니다.
    },
  });

  // Prisma update는 업데이트된 레코드 객체를 반환하며, 
  // 업데이트된 행의 수를 직접 반환하지는 않습니다.
  // 성공적으로 업데이트되면 객체가 반환되므로, 1을 반환하거나 객체 자체를 반환합니다.
  // 여기서는 SQL 쿼리 결과와 유사하게 1(성공) 또는 null/에러(실패)로 처리할 수 있습니다.
  
  // 성공 시 1을 반환하도록 처리
  return 1; 
  // 혹은 업데이트된 사용자 객체를 반환하여 서비스 계층에서 활용할 수도 있습니다.
  // return result;
};