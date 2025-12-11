const axios = require('axios');

async function testAuth() {
  const baseURL = 'http://localhost:3001/api';
  
  try {
    // 1. Try to access protected route (projects) without token
    console.log('Testing access to protected route (NO TOKEN)...');
    try {
      await axios.get(`${baseURL}/projects`);
      console.error('FAIL: Protected route was accessible without token!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('PASS: Protected route blocked (401).');
      } else {
        console.error('FAIL: Unexpected error:', error.message);
      }
    }

    // 2. Login
    console.log('\nTesting Login...');
    let token;
    try {
      const loginRes = await axios.post(`${baseURL}/auth/login`, {
        username: 'admin',
        password: 'adminpassword'
      });
      token = loginRes.data.token;
      console.log('PASS: Login successful. Token received.');
    } catch (error) {
      console.error('FAIL: Login failed:', error.response ? error.response.data : error.message);
      return;
    }

    // 3. Access protected route WITH token
    console.log('\nTesting access to protected route (WITH TOKEN)...');
    try {
      const projectRes = await axios.get(`${baseURL}/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (projectRes.status === 200) {
        console.log('PASS: Protected route accessible with token.');
      } else {
        console.error('FAIL: Status not 200:', projectRes.status);
      }
    } catch (error) {
      console.error('FAIL: Access with token failed:', error.response ? error.response.data : error.message);
    }

  } catch (err) {
    console.error('Major error:', err);
  }
}

testAuth();
