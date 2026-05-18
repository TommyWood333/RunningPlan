const https = require('https');

module.exports = async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;

  if (error) {
    return res.redirect(`/?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({error: 'No authorization code'});
  }

  try {
    const tokenResponse = await exchangeCode(code);
    const athlete = tokenResponse.athlete;
    
    const redirectUrl = `/?strava_token=${tokenResponse.access_token}&athlete_name=${encodeURIComponent(athlete.firstname + ' ' + athlete.lastname)}&athlete_id=${athlete.id}`;
    
    return res.redirect(redirectUrl);
  } catch (err) {
    return res.status(500).json({error: err.message});
  }
};

function exchangeCode(code) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      client_id: '246912',
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'https://tomwoodsrunningapp.vercel.app/api/strava-callback'
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
