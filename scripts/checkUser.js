require('../access_env');
const { User } = require('../src/models');

async function checkUser() {
  try {
    const username = 'jobostructurals@gmail.com';
    const user = await User.findOne({ where: { username } });

    if (user) {
      console.log('User found.');
      console.log('ID:', user.id);
      console.log('Stored Password Hash (first 20 chars):', user.password.substring(0, 20) + '...');
      console.log('Is valid Django format?', user.password.startsWith('pbkdf2_sha256$'));
    } else {
      console.log('User NOT found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkUser();
