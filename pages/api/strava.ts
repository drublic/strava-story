import { stravaClientId } from "@/config";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const redirectUri = `://${req.headers.host}/`; // Update with your actual redirect URI
  const protocol = redirectUri.includes("localhost") ? "http" : "https";

  const { code } = req.query;

  try {
    if (!code) {
      // Step 1: Redirect user to Strava for authentication
      const authUrl = `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&redirect_uri=${protocol}${redirectUri}&response_type=code&scope=activity:read_all`;

      res.redirect(authUrl);
    } else {
      res.json({ code });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

export default handler;
