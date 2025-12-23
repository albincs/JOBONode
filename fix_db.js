import sequelize from './src/config/database.js';
import SentEmail from './src/models/SentEmail.js';

const fixDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        
        // Sync only the SentEmail model
        await SentEmail.sync({ alter: true });
        console.log('SentEmail table synced/created successfully.');
        
    } catch (error) {
        console.error('Error fixing database:', error);
    } finally {
        await sequelize.close();
    }
};

fixDatabase();
