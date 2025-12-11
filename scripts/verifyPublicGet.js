const axios = require('axios');

async function testPublicGet() {
  const baseURL = 'http://localhost:3001/api';
  
  try {
    // 1. Try to access Public GET (projects) without token
    console.log('Testing access to PUBLIC GET route (NO TOKEN)...');
    try {
      const res = await axios.get(`${baseURL}/projects`);
      if (res.status === 200) {
        console.log('PASS: Public GET route accessible (200).');
      } else {
        console.error('FAIL: Status not 200:', res.status);
      }
    } catch (error) {
      console.error('FAIL: Public GET blocked:', error.response ? error.response.status : error.message);
    }

    // 2. Try to access Protected POST (awards) without token
    // We need to use multipart/form-data for awards, but simplified check:
    console.log('\nTesting access to PROTECTED POST route (NO TOKEN)...');
    try {
      await axios.post(`${baseURL}/awards`, {});
      console.error('FAIL: Protected POST route was accessible without token!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('PASS: Protected POST route blocked (401).');
      } else {
        console.error('FAIL: Unexpected error:', error.message);
      }
    }

  } catch (err) {
    console.error('Major error:', err);
  }
}

testPublicGet();
