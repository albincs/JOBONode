const { User, Project } = require('../src/models');
const sequelize = require('../src/config/database');

async function checkPK() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    console.log('User PKs:', User.primaryKeyAttributes);
    console.log('Project PKs:', Project.primaryKeyAttributes);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkPK();
