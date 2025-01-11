import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import logger from "../utils/logger/logger";
import dbConfig from "../config.json";

const sequelize = new Sequelize(
  dbConfig.DATABASE.MYSQL_DATABASE,
  dbConfig.DATABASE.MYSQL_USER,
  dbConfig.DATABASE.MYSQL_PASSWORD,
  {
    host: dbConfig.DATABASE.MYSQL_HOST,
    port: dbConfig.DATABASE.MYSQL_PORT,
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

const db = {};
logger.info("모델 갯수 :", Object.keys(db).length);

const modelsDir = path.join(__dirname, "define");
const modelFiles = fs.readdirSync(modelsDir);
modelFiles
  .filter(
    (file) =>
      file.slice(-3) === ".js" &&
      !file.startsWith(".") &&
      !file.endsWith(".test.js")
  )
  .forEach((file) => {
    const model = require(path.join(modelsDir, file)).default;
    model.init(sequelize);
    db[model.name] = model;
  });

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

export default db;
