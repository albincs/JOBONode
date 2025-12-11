import { Sequelize } from "sequelize";
import accessEnv from "../../access_env.js";

const sequelize = new Sequelize(
  accessEnv("DB_NAME", "u352242787_jobodb"),
  accessEnv("DB_USER", "u352242787_jobodb"),
  accessEnv("DB_PASSWORD", "Goddadmom984098"),
  {
    host: accessEnv("DB_HOST", "srv834.hstgr.io"),
    port: accessEnv("DB_PORT", 3306),
    dialect: "mysql",
    logging: false,
    timezone: "+00:00", // for writing to database
  }
);

export default sequelize;
