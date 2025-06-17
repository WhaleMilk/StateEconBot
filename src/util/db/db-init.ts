import { Sequelize } from 'sequelize';
import { initUserModel } from './models/Users';
import * as path from 'path';

const dbPath = path.join(__dirname, '../../../database.sqlite');
console.log('Database path:', dbPath);

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log // Enable logging to see SQL queries
});

// Initialize models
const User = initUserModel(sequelize);

// Sync database with force: false to preserve data
sequelize.sync({ force: false })
    .then(() => console.log('Database synced successfully'))
    .catch(err => console.error('Error syncing database:', err));

export { sequelize, User };
