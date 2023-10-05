import React, { useEffect } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ActionType, useGlobalState } from "@/context/GlobalStateContext";
import convertSeconds from "@/lib/convertSeconds";

const StravaActivities = () => {
  const { state, dispatch } = useGlobalState();

  useEffect(() => {
    if (!state.code || state.activities.length > 0) {
      return;
    }

    const fetchActivities = async () => {
      try {
        const response = await axios.get(`/api/data?code=${state.code}`);

        dispatch({
          type: ActionType.SET_ACTIVITY_DATA,
          payload: response.data,
        });
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, [dispatch, state.code, state.activities]);

  if (state.activities.length === 0) {
    return null;
  }

  return (
    <div className="container p-4">
      <h2 className="text-2xl font-semibold">Latest Activities</h2>

      <ul role="list" className="divide-y divide-gray-700">
        {state.activities.map((activity: any) => (
          <li key={activity.id} className="flex justify-between gap-x-6 py-8">
            <Link
              href={`/activities/${activity.id}`}
              className="flex w-full items-center"
            >
              <div className="min-w-0 flex-auto">
                <p className="text-lg font-semibold leading-6 text-gray-100">
                  {activity.name}
                </p>

                <p className="text-xs leading-6 text-gray-400 pb-2">
                  {new Date(activity.start_date_local).toLocaleString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                  })}{" "}
                  - {activity.type}
                </p>

                <div className="flex gap-x-6">
                  <div>
                    <p className="text-xs leading-6 text-gray-400">Distance</p>

                    <p className="text-md leading-6 text-gray-100">
                      {(activity.distance / 1000).toFixed(2)} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs leading-6 text-gray-400">Time</p>

                    <p className="text-md leading-6 text-gray-100">
                      {convertSeconds(activity.moving_time)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs leading-6 text-gray-400">Avg Watts</p>

                    <p className="text-md leading-6 text-gray-100">
                      {activity.average_watts}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1"></div>
              <div className="w-6">
                <ChevronRight className="text-gray-500" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StravaActivities;
