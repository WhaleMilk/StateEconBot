import { Sequelize, DataTypes } from "sequelize";
import { initUserModel } from "./models/Users";

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const User = initUserModel(sequelize);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync().then(() => {
    console.log('Database & tables created!');
    sequelize.close();
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
    sequelize.close();
});
