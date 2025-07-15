import { Sequelize } from 'sequelize';
import { initUserModel } from './models/Users';
import { initGovernmentModel } from './models/Government';
import { setupAssociations } from './db-objects';
import * as path from 'path';
import * as fs from 'fs';

// Get the absolute path to the database file
const dbPath = path.resolve(__dirname, '../../../database.sqlite');
console.log('Database path:', dbPath);

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: console.log, // Enable logging to see SQL queries
    define: {
        timestamps: false
    }
});

// Initialize models
const User = initUserModel(sequelize);
const Government = initGovernmentModel(sequelize);
// const Company = initCompanyModel(sequelize);

// Setup associations between models; 
setupAssociations();

// Function to initialize database; mostly debugging stuff
async function initializeDatabase() {
    try {
        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // Sync database with force: false to preserve data
        await sequelize.sync({ force: false });
        console.log('Database synced successfully');
        
        // Test a simple query to ensure everything is working
        const count = await User.count();
        console.log(`Database contains ${count} users`);
        
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}

// Initialize the database immediately
initializeDatabase().catch(console.error);

export { sequelize, User, Government, initializeDatabase };
