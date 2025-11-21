/**
 * 모든 커스텀 에러의 기본이 되는 클래스입니다. 
 */
class BaseError extends Error {
  constructor(reason, data, statusCode, errorCode) {
    super(reason);
    this.reason = reason;
    this.data = data;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    // V8 환경에서 스택 트레이스를 유지하기 위함
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

// ----------------------------------------------------------------------
// 1. 사용자/인증 관련 오류 (400, 401, 404, 409)
// ----------------------------------------------------------------------

// U001: 이미 존재하는 리소스 (회원가입 시 이메일 중복)
export class DuplicateUserEmailError extends BaseError {
  constructor(reason = "이미 사용 중인 이메일 주소입니다.", data) {
    super(reason, data, 409, "U001"); // 409 Conflict
  }
}

// U002: 필수 입력 필드 누락
export class MissingRequiredFieldError extends BaseError {
  constructor(reason = "필수 입력 항목이 누락되었습니다.", data) {
    super(reason, data, 400, "U002"); // 400 Bad Request
  }
}

// U003: 인증 실패 (로그인 시 비밀번호 불일치 등)
export class AuthenticationFailedError extends BaseError {
  constructor(reason = "이메일 또는 비밀번호가 일치하지 않습니다.", data = null) {
    super(reason, data, 401, "U003"); // 401 Unauthorized
  }
}

// U004: 사용자/리소스를 찾을 수 없음 (기본 404)
export class ResourceNotFoundError extends BaseError {
  constructor(reason = "요청하신 리소스를 찾을 수 없습니다.", data) {
    super(reason, data, 404, "U004"); // 404 Not Found
  }
}


// ----------------------------------------------------------------------
// 2. 도메인별 리소스 오류 (404, 409)
// ----------------------------------------------------------------------

// M001: 미션 관련 리소스를 찾을 수 없음
export class MissionNotFoundError extends ResourceNotFoundError {
  constructor(reason = "해당 ID의 미션을 찾을 수 없습니다.", data) {
    super(reason, data, 404, "M001");
  }
}

// R001: 리뷰 관련 리소스를 찾을 수 없음
export class ReviewNotFoundError extends ResourceNotFoundError {
  constructor(reason = "해당 ID의 리뷰를 찾을 수 없습니다.", data) {
    super(reason, data, 404, "R001");
  }
}

// R002: 리뷰 작성 권한 없음 또는 이미 작성함 (리뷰 중복 작성)
export class ReviewCreationConflictError extends BaseError {
  constructor(reason = "이미 해당 주문에 대해 리뷰를 작성했습니다.", data) {
    super(reason, data, 409, "R002"); // 409 Conflict
  }
}

// S001: 가게 관련 리소스를 찾을 수 없음
export class StoreNotFoundError extends ResourceNotFoundError {
  constructor(reason = "해당 ID의 가게 정보를 찾을 수 없습니다.", data) {
    super(reason, data, 404, "S001");
  }
}


// ----------------------------------------------------------------------
// 3. 시스템/DB 트랜잭션 오류 (500)
// ----------------------------------------------------------------------

// X001: 트랜잭션 실패 (DB 롤백 필요)
export class TransactionFailedError extends BaseError {
  constructor(reason = "데이터베이스 트랜잭션 처리 중 오류가 발생하여 작업이 취소되었습니다.", data) {
    super(reason, data, 500, "X001"); // 500 Internal Server Error
  }
}