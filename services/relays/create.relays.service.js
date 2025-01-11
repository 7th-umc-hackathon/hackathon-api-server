import { Relay, RelayUser, User } from "../../models/index.js";

export const createNewRelay = async (userId, data) => {
  const userCountryId = await User.findOne({
    where: {
      user_id: userId,
    },
    attributes: ["country_id"],
  });

  //새로운 릴레이 생성
  const newRelay = await Relay.create({
    mission: data.mission,
    reward: data.reward,
    status: "in_progress",
    current_country_id: userCountryId.country_id,
    next_country_id: userCountryId.country_id,
    unique_country_count: data.unique_country_count,
    client_relay_count: 1,
  });

  //생성한 릴레이에 대한 relayUser 생성
  await RelayUser.create({
    user_id: userId,
    relay_id: newRelay.relay_id,
    status: "waiting",
  });

  console.log(newRelay);

  return newRelay;
};
