require('../access_env');
const { User } = require('../src/models');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'adminpassword';
    const email = 'admin@example.com';

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: {
        password: password_hash,
        email,
        role: 'admin',
        is_staff: true,
        is_superuser: true,
        is_active: true,
        date_joined: new Date()
      }
    });

    if (created) {
      console.log('Admin user created successfully.');
      console.log(`Username: ${username}`);
      console.log(`Password: ${password}`);
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit();
  }
}

createAdmin();
