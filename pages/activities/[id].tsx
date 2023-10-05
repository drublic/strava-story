// pages/ActivityDetail.tsx
import React, { FC, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import { ChevronLeft } from "lucide-react";
import { Share } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateContext";
import ActivityMap from "@/components/ActivityMap";
import Link from "next/link";
import convertSeconds from "@/lib/convertSeconds";

const Divider = () => (
  <div className="bg-slate-500 h-8 mt-2 mx-1" style={{ width: 1 }}></div>
);

const Detail: FC<{ title: string; value: string }> = ({ title, value }) => (
  <div className="px-3 flex-auto">
    <p className="text-sm text-gray-400">{title}</p>

    <p className="text-lg text-gray-100">{value}</p>
  </div>
);

const ActivityDetail: FC<{ mapboxToken: string }> = ({ mapboxToken }) => {
  const params = useParams();
  const { state } = useGlobalState();
  const activity = state.activities.find((a) => `${a.id}` === params?.id);
  const [isDoingScreenshot, setIsDoingScreenshot] = useState(false);

  useEffect(() => {
    if (!isDoingScreenshot) {
      return;
    }

    const screenshotTarget = document.body;

    html2canvas(screenshotTarget).then((canvas) => {
      const base64image = canvas.toDataURL("image/png");

      let fileName = "image";
      const link = document.createElement("a");
      link.download = fileName + ".png";
      link.href = base64image;
      link.click();

      setIsDoingScreenshot(false);
    });
  }, [isDoingScreenshot]);

  if (!activity) {
    return <div>Activity not found</div>;
  }

  return (
    <>
      <div className="absolute top-0 z-10 w-full h-24 bg-gradient-to-b from-black opacity-70"></div>
      {!isDoingScreenshot && (
        <div className="absolute top-2 z-20 w-full flex">
          <Link href="/" className="p-4 w-16">
            <ChevronLeft className="text-gray-500" />
          </Link>
          <div className="flex-auto"></div>
          <div onClick={() => setIsDoingScreenshot(true)} className="p-4 w-16">
            <Share className="text-gray-500" />
          </div>
        </div>
      )}

      <ActivityMap mapboxToken={mapboxToken} activity={activity} />

      <div className="absolute bottom-0 z-10 w-full h-48 bg-gradient-to-t from-black opacity-70"></div>
      <div className="absolute bottom-0 z-20 w-full">
        <div className="items-center pt-4 pb-12">
          <div className="w-full flex">
            <Detail title="Time" value={convertSeconds(activity.moving_time)} />
            <Divider />
            <Detail
              title="Distance"
              value={`${(activity.distance / 1000).toFixed(2)} km`}
            />
            <Divider />
            <Detail
              title="Elev Gain"
              value={`${activity.total_elevation_gain} m`}
            />
            <Divider />
            <Detail
              title="Avg Speed"
              value={`${(activity.average_speed * 3.6).toFixed(1)} kph`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: {
      mapboxToken: process.env.MAPBOX_TOKEN,
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default ActivityDetail;
