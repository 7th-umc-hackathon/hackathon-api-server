import {
  Country,
  RelayUser,
  sequelize,
  Sequelize,
  User,
} from "../../models/index.js";

export const userProfile = async (userId) => {
  // User 모델에서 특정 userId를 가진 사용자 레코드를 찾습니다.
  return await User.findOne({
    // 반환된 사용자 객체에서 password 속성을 제외합니다.
    attributes: {
      exclude: ["password"],
    },
    // user_id가 주어진 userId와 일치하는 레코드를 찾습니다.
    where: {
      user_id: userId,
    },
    // 여러 모델을 조인하여 사용자와 관련된 정보를 포함합니다.
    include: [
      {
        model: Country,
        as: "country",
        attributes: {
          exclude: ["created_at", "updated_at"],
        },
        where: {
          country_id: Sequelize.col("User.country_id"),
        },
      },
      {
        model: RelayUser,
        as: "relay_users",
        where: {
          user_id: Sequelize.col("User.user_id"),
        },
        required: false,
      },
    ],
  });
};

export const userRanking = async (userId) => {
  // point 기준으로 내림차순 정렬해서 해당 userId가 몇번째인지 찾기
  const users = await User.findAll({
    attributes: [
      "user_id",
      [sequelize.literal("RANK() OVER (ORDER BY point DESC)"), "rank"],
    ],
    order: [["point", "DESC"]],
  });

  const user = users.find((u) => u.user_id === userId);
  return user ? user.get("rank") : null;
};

export const userRankList = async (userId) => {
  // point 기준으로 내림차순 정렬해서 해당 userId가 몇번째인지 찾기
  const users = await User.findAll({
    attributes: [
      "user_id",
      [sequelize.literal("RANK() OVER (ORDER BY point DESC)"), "rank"],
    ],
    order: [["point", "DESC"]],
  });

  return users;
};

// // 국가 랭킹을 산출해야 함.
// // user들을 country_id로 묶어서 point 합산 후 내림차순 정렬

export const countryRanking = async () => {
  const countries = await Country.findAll({
    attributes: {
      exclude: ["created_at", "updated_at"],
    },
    include: [
      {
        model: User,
        as: "users",
        attributes: {
          exclude: ["created_at", "updated_at"],
        },
      },
    ],
  });

  const countryOrdered = countries.map((country) => {
    const users = country.get("users");
    const totalPoint = users.reduce((acc, user) => acc + user.get("point"), 0);
    const countryData = country.get();
    delete countryData.users;
    return {
      ...countryData,
      totalPoint,
    };
  });

  const sortCountry = countryOrdered
    .sort((a, b) => b.totalPoint - a.totalPoint)
    .map((country, index) => ({
      ...country,
      rank: index + 1,
    }));

  return sortCountry;
};

export const myCountryRanking = async (userId) => {
  const countries = await Country.findAll({
    attributes: [
      "country_id",
      "common_name",
      [sequelize.fn("SUM", sequelize.col("users.point")), "totalPoint"],
    ],
    include: [
      {
        model: User,
        as: "users",
        attributes: [],
      },
    ],
    group: ["Country.country_id"],
    order: [[sequelize.literal("totalPoint"), "DESC"]],
    raw: true,
  });

  const rankedCountries = countries.map((country, index) => ({
    ...country,
    rank: index + 1,
    totalPoint: parseInt(country.totalPoint) || 0,
  }));

  const user = await User.findOne({
    attributes: ["country_id"],
    where: { user_id: userId },
    raw: true,
  });

  const userCountry = rankedCountries.find(
    (country) => country.country_id === user.country_id
  );

  return userCountry ? userCountry.rank : null;
};
