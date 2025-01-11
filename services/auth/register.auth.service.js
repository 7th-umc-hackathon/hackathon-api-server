import { generateHashedPassword } from "../../utils/cipher/encrypt.js";
import { Country, User } from "../../models/index.js";
import { AlreadyExistsError } from "../../utils/errors/errors.js";

export const userRegister = async ({
  login_id,
  password,
  name,
  nickname,
  email,
  country_id,
}) => {
  // (나중에) 이미 존재하는 사용자인지 검토

  const encryptedPassword = await generateHashedPassword(password);

  // 사용자 등록
  const user = await User.create({
    login_id,
    password: encryptedPassword,
    name,
    nickname,
    email,
    country_id,
  });

  return user;
};

export const getCountries = async () => {
  try {
    const countries = await Country.findAll();
    return countries;
  } catch (err) {
    throw err;
  }
};

export const checkIdUnique = async (login_id) => {
  const user = await User.findOne({
    attributes: ["login_id"],
    where: {
      login_id,
    },
  });

  // user가 존재하면 false, 존재하지 않으면 true
  if (user) throw new AlreadyExistsError("이미 존재하는 아이디입니다.");
  return true;
};
