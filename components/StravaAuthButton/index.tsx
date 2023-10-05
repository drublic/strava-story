import React from "react";
import Link from "next/link";

const StravaAuthButton = () => {
  return (
    <Link
      href="/api/strava"
      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
    >
      Connect with Strava
    </Link>
  );
};

export default StravaAuthButton;
