import axios from "axios";
import querystring from "querystring";
import { NextApiRequest, NextApiResponse } from "next";
import { stravaClientId, stravaClientSecret } from "@/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  const tokenResponse = await axios.post(
    "https://www.strava.com/oauth/token",
    querystring.stringify({
      client_id: stravaClientId,
      client_secret: stravaClientSecret,
      code,
      grant_type: "authorization_code",
    })
  );

  const { access_token } = tokenResponse.data;

  // Step 3: Fetch user's activities using the access token
  const activitiesResponse = await axios.get(
    "https://www.strava.com/api/v3/athlete/activities",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  res.json(activitiesResponse.data);
};

export default handler;
