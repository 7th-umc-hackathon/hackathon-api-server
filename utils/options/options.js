import config from "../../config.js";
const { SERVER_DOMAIN } = config.SERVER;

export const corsOptions = {
  origin: ["http://localhost:5175"], // CORS domain 설정
  // origin: "*", // CORS domain 설정
  credentials: true,
};

// SSL 인증서 로드
// export const sslOptions = {
//   key: fs.readFileSync("localhost-key.pem"), // 개인 키 파일
//   cert: fs.readFileSync("localhost-cert.pem"), // 인증서 파일
// };

export const refreshTokenCookieOptions = {
  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  httpOnly: true,
  sameSite: "none",
  secure: true,
  domain: SERVER_DOMAIN, // 백엔드 도메인
  path: "/",
};
