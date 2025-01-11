import Sequelize from "sequelize";
import logger from "../utils/logger/logger.js";
import config from "../config.js";

import User from "./database/user.js";
import Relay from "./database/relay.js";
import RelayUser from "./database/relay_user.js";
import Country from "./database/country.js";

const sequelize = new Sequelize(
  config.DATABASE.MYSQL_DATABASE,
  config.DATABASE.MYSQL_USER,
  config.DATABASE.MYSQL_PASSWORD,
  {
    host: config.DATABASE.MYSQL_HOST,
    port: config.DATABASE.MYSQL_PORT,
    dialect: "mysql",
    logging: (msg) => logger.debug(`[Sequelize ✨]\n${msg} ✨`),
    timezone: "+09:00",
    pool: {
      max: 10, // 최대 연결 수
      min: 0, // 최소 연결 수
      acquire: 30000, // 연결을 가져오는 최대 시간 (ms)
      idle: 10000, // 연결이 유휴 상태일 때 종료되기까지의 시간 (ms)
    },
  }
);

const db = { User, Relay, RelayUser, Country };

// console.log(db);

// db.User.init(sequelize);
// db.Relay.init(sequelize);
// db.RelayUser.init(sequelize);
// db.Country.init(sequelize);

// db.User.associate(db);
// db.Relay.associate(db);
// db.RelayUser.associate(db);
// db.Country.associate(db);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].init) {
    db[modelName].init(sequelize);
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { User, Relay, RelayUser, Country, sequelize, Sequelize };
