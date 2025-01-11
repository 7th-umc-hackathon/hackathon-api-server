import { createAccessToken } from "./auth.token.service.js";

console.log(createAccessToken({ user_id: 1, name: "test", nickname: "test" }));
