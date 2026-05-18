// Netlify Function: netlify/functions/strava-callback.js
// This handles the OAuth callback from Strava

const STRAVA_CLIENT_ID = "246912";
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

exports.handler = async (event) => {
  const code = event.queryStringParameters?.code;
  const error = event.queryStringParameters?.error;

  if (error) {
    return {
      statusCode: 302,
      headers: {
        Location: "/?error=" + encodeURIComponent(error),
      },
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      body: "Missing authorization code",
    };
  }

  try {
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return {
        statusCode: 400,
        body: "Failed to exchange code for token",
      };
    }

    const tokenData = await tokenResponse.json();
    const token = encodeURIComponent(tokenData.access_token);
    const athleteName = encodeURIComponent(tokenData.athlete?.firstname || "");
    const athleteId = tokenData.athlete?.id || "";

    // Redirect back to the app with token in URL params
    return {
      statusCode: 302,
      headers: {
        Location: `/?strava_token=${token}&athlete_name=${athleteName}&athlete_id=${athleteId}`,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Server error: " + error.message,
    };
  }
};
