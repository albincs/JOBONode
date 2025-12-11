const { User, Project } = require('../src/models');
const sequelize = require('../src/config/database');

async function checkIds() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    console.log('--- USERS ---');
    const users = await User.findAll({ limit: 5 });
    users.forEach(u => {
        console.log(`User ID: ${u.id} (Type: ${typeof u.id}) - Username: ${u.username}`);
    });

    console.log('--- PROJECTS ---');
    const projects = await Project.findAll({ limit: 5 });
    projects.forEach(p => {
        console.log(`Project ID: ${p.id} (Type: ${typeof p.id}) - Title: ${p.title}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkIds();
