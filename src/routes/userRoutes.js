import express from "express";

const router = express.Router();

// 1. 유저 생성
// POST /api/v1/users
router.post('/', (req, res, next) => {
    // #swagger.tags = ['User']
    /*
    #swagger.summary = '회원 가입 API';
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              email: { type: "string", description: "사용자 이메일 (VARCHAR(30))", maxLength: 30 },
              password: { type: "string" },
              name: { type: "string" },
              nickname: { type: "string" },
              role: { type: "string" },
              point: { type: "number" },
              gender: { type: "string" },
              date: { type: "string", format: "date" },
              address: { type: "string" },
            }
          }
        }
      }
    };
    */
    
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        // 필수 필드 누락 시 400 Bad Request 응답 반환
        return res.status(400).json({
            resultType: "FAIL",
            error: {
                errorCode: "U001",
                reason: "필수 입력 항목(email, password, name)이 누락되었습니다.",
                data: null
            },
            success: null
        });
    }

    /*
    #swagger.responses[201] = {
      description: "회원 가입 성공 및 사용자 리소스 생성",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  userId: { type: "number", example: 123 }, // 생성된 유저 ID
                  email: { type: "string" },
                  name: { type: "string" },
                  // preferCategory 대신 생성된 유저의 핵심 정보를 넣는 것이 좋습니다.
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "회원 가입 실패 응답",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U001" },
                  reason: { type: "string" },
                  data: { type: "object" }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
    res.status(201).json({
      resultType: "SUCCESS",
      error: null,
      success: {
          userId: 123,
          email: "test@example.com",
          name: "홍길동"
      },
    });
});

// 2. 유저 조회
// GET /api/v1/users
router.get('/', (req, res) => {
    // #swagger.tags = ['User']
    // ... 회원가입 관련 Swagger 주석 ...
    // ...
});

export default router;