const https = require('https');

exports.handler = async (event) => {
  const code = event.queryStringParameters?.code;
  const error = event.queryStringParameters?.error;

  if (error) {
    return {
      statusCode: 302,
      headers: { Location: '/?error=' + error },
      body: ''
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: 'No authorization code'})
    };
  }

  try {
    const tokenResponse = await exchangeCode(code);
    const athlete = tokenResponse.athlete;
    
    const redirectUrl = `/?strava_token=${tokenResponse.access_token}&athlete_name=${encodeURIComponent(athlete.firstname + ' ' + athlete.lastname)}&athlete_id=${athlete.id}`;
    
    return {
      statusCode: 302,
      headers: { Location: redirectUrl },
      body: ''
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({error: err.message})
    };
  }
};

function exchangeCode(code) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      client_id: '246912',
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code'
    });

    const options = {
      hostname: 'www.strava.com',
      port: 443,
      path: '/api/v3/oauth/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Strava returned ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}
