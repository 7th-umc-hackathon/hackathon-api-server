const logger = require("../logger/logger");
const { logError } = require("./error.logger");

const responseHandler = (req, res, next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error: null, success });
  };

  res.error = ({
    errorCode = "UNHANDLED_ERROR",
    reason = null,
    data = null,
  }) => {
    return res.json({
      resultType: "FAIL",
      error: { errorCode, reason, data },
      success: null,
    });
  };

  next();
};

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    logger.error(
      "이미 응답이 전송된 요청에 대해 에러 핸들러가 호출되었습니다."
    );
    return next(err);
  }
  logError(err);
  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "UNHANDLED_ERROR",
    reason: err.reason || err.message || null,
    data: err.data || null,
    // 여기에 아무리 추가해봤자 위에 error에 정의를 안해놔서 의미없음
    // 그래서 지워버렸습니당 ~
  });
};

module.exports = {
  responseHandler,
  errorHandler,
};
