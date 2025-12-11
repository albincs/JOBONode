require('../access_env');
const sequelize = require('../src/config/database');
const { User } = require('../src/models');

async function syncDb() {
  try {
    console.log('Syncing User model...');
    await User.sync({ alter: true });
    console.log('User model verified/updated.');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    process.exit();
  }
}

syncDb();
