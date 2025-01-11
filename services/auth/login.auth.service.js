import { User } from "../../models/index.js";

export const getUserByLoginId = async (login_id) => {
  try {
    const user = await User.findOne({
      where: {
        login_id,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};
