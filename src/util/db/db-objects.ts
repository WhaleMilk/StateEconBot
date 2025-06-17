import { Sequelize } from "sequelize";
import { initUserModel } from "./models/Users";

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

export const User = initUserModel(sequelize);

