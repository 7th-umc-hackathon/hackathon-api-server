import {
  User,
  Relay,
  RelayUser,
  Country,
  sequelize,
  Sequelize,
} from "../../models/index.js";
import { NotExistsError } from "../../utils/errors/errors.js";
import logger from "../../utils/logger/logger.js";

// 새로운 릴레이 배정 가져오기
// (Relay 테이블의 next_country_id가 User 테이블의 country_id와 같아야 하고.. relay 테이블의 status가 "open"인 것에서..)
export const assignment = async (userId) => {
  const user = await User.findOne({ where: { user_id: userId } });

  if (!user) {
    throw new NotExistsError("사용자를 찾을 수 없습니다.");
  }

  const countryId = user.country_id;

  const relay = await Relay.findOne({
    where: {
      next_country_id: countryId,
      status: "open",
    },
  });

  if (relay) {
    return relay;
  } else {
    // 조건에 맞는 릴레이가 없을 경우
    throw new NotExistsError("해당 조건에 맞는 릴레이를 찾을 수 없습니다.");
  }
};

// 현재 릴레이 배정을 확정하기
export const confirmAssignment = async (userId) => {
  const user = await User.findOne({ where: { user_id: userId } });

  if (!user) {
    throw new NotExistsError("사용자를 찾을 수 없습니다.");
  }

  const countryId = user.country_id;

  const relay = await Relay.findOne({
    where: {
      next_country_id: countryId,
      status: "open",
    },
  });

  if (!relay) {
    throw new NotExistsError("해당 조건에 맞는 릴레이가 없습니다.");
  }

  relay.status = "in_progress"; // 릴레이 상태 open --> in_progress
  await relay.save();

  await RelayUser.create({
    user_id: userId,
    relay_id: relay.relay_id,
    status: "wait", // in_progress랑 wait 구별해야 할 것 같은데..
  });

  return relay;
};

// 다음 타자로 가능한 국가 띄우기
export const getNextCountries = async (userId, relayId) => {
  const user = await User.findOne({ where: { user_id: userId } });

  if (!user) {
    throw new NotExistsError("사용자를 찾을 수 없습니다.");
  }
  /*
    relay의 unique_country_count를 가져오기
    relay_user를 id DESC 순으로 정렬, limit uqniue_country_count
    가져온 거의 user_id의 country_id를 제외한 모든 것
    */

  const userCountryId = user.country_id; // 현재 유저의 국가

  const uniqueCountryCount = await Relay.findByPk(relayId).unique_country_count;

  // 이전에 해당 릴레이에 참여한 적 있는 국가
  let excludedCountryIds = await RelayUser.findAll({
    where: { relay_id: relayId },
    attributes: ["user_id"],
    include: {
      model: User,
      as: "user",
      attributes: ["country_id"],
    },
    order: [["relay_user_id", "DESC"]],
    limit: uniqueCountryCount,
  });
  excludedCountryIds = excludedCountryIds.map(
    (relayUser) => relayUser.user.country_id
  );

  console.log(excludedCountryIds);

  const nextCountries = await Country.findAll({
    where: {
      country_id: {
        [Sequelize.Op.ne]: userCountryId, // 현재 유저의 country_id와 다름
        [Sequelize.Op.notIn]: excludedCountryIds, // 이전에 참여한 국가 제외
      },
    },
  });

  return nextCountries;
};

// 다음 타자 국가 선택
export const confirmCountry = async (userId, relayId, nextCountryId) => {
  const user = await User.findOne({ where: { user_id: userId } });

  if (!user) {
    throw new NotExistsError("사용자를 찾을 수 없습니다.");
  }

  const relay = await Relay.findOne({ where: { relay_id: relayId } });

  if (!relay) {
    throw new NotExistsError("릴레이를 찾을 수 없습니다.");
  }

  // next_country_id를 선택한 국가로 업데이트
  relay.next_country_id = nextCountryId;
  relay.status = "open";
  await relay.save();

  return confirmCountry;
};
