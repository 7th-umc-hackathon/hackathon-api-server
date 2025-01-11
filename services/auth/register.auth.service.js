import { generateHashedPassword } from "../../utils/cipher/encrypt.js";
import { User } from "../../models/index.js";

export const userRegister = async ({
  login_id,
  password,
  name,
  country_id,
}) => {
  // (나중에) 이미 존재하는 사용자인지 검토

  const encryptedPassword = await generateHashedPassword(password);

  // 사용자 등록
  const user = await User.create({
    login_id,
    password: encryptedPassword,
    name,
    country_id,
  });

  return user;
};
