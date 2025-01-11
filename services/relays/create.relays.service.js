import { Relay, RelayUser, User } from "../../models/index.js";

export const createNewRelay = async ({
  userId,
  mission,
  unique_country_count,
}) => {
  const userCountryId = await User.findOne({
    where: {
      user_id: userId,
    },
    attributes: ["country_id"],
  });

  //새로운 릴레이 생성
  const newRelay = await Relay.create({
    mission: mission,
    reward: 1,
    status: "in_progress",
    current_country_id: userCountryId.country_id,
    next_country_id: userCountryId.country_id,
    unique_country_count,
  });

  //생성한 릴레이에 대한 relayUser 생성
  await RelayUser.create({
    user_id: userId,
    relay_id: newRelay.relay_id,
    reward_relay_count: unique_country_count,
    status: "waiting",
  });

  console.log(newRelay);

  return newRelay;
};
