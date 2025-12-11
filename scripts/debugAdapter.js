const { Project } = require('../src/models');
const sequelize = require('../src/config/database');
const AdminJSSequelize = require('@adminjs/sequelize');
const AdminJS = require('adminjs');

AdminJS.registerAdapter(AdminJSSequelize);

async function checkAdapter() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const resource = new AdminJSSequelize.Resource(Project);
    
    // Test count
    // AdminJS adapter expects a Filter instance, or at least something it can process.
    // Actually, resource.count takes (filter) where filter is likely an AdminJS Filter instance.
    // Creating a mock filter.
    const filter = new AdminJS.Filter({}, resource);
    const count = await resource.count(filter);
    console.log('Adapter Count for Project:', count); // Should be 5

    // Test find
    const records = await resource.find({}, { limit: 10, offset: 0 });
    console.log('Adapter Find (Limit 10):', records.length); // Should be 5

    if(count === 1 && records.length > 1) {
        console.log('CRITICAL: Count is 1 but records > 1. This causes "Select All" bug.');
    } else {
        console.log('Adapter seems correct.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkAdapter();
