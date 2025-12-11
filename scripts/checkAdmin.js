const axios = require('axios');

async function checkAdmin() {
  try {
    console.log('Checking /admin...');
    const res = await axios.get('http://localhost:3001/admin', {
        maxRedirects: 0, // We expect a redirect to login
        validateStatus: (status) => status >= 200 && status < 400 || status === 302 || status === 303 
    });
    console.log(`Status: ${res.status}`);
    if (res.status === 200 || res.status === 302 || res.status === 303) {
        console.log('PASS: Admin panel is reachable.');
    } else {
        console.error('FAIL: Unexpected status.');
    }
  } catch (error) {
    if (error.response && (error.response.status === 302 || error.response.status === 303)) {
         console.log('PASS: Admin panel redirects (likely to login).');
    } else {
        console.error('FAIL: Admin panel not reachable:', error.message);
    }
  }
}

checkAdmin();
