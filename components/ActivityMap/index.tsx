// components/ActivityMap.tsx
import React from "react";
import ReactMapGL, { Layer, Source } from "react-map-gl";
import { LngLatBounds, LngLatLike } from "mapbox-gl";
import polyline from "polyline";

interface ActivityMapProps {
  activity: any;
  mapboxToken: string;
}

const ActivityMap: React.FC<ActivityMapProps> = ({ activity, mapboxToken }) => {
  const decodedPolyline = polyline.decode(activity.map.summary_polyline);
  const reversedPolyline = decodedPolyline.map((p) => [p[1], p[0]]);

  const bounds = reversedPolyline.reduce(
    (bounds, coord) => bounds.extend(coord as LngLatLike),
    new LngLatBounds(
      reversedPolyline[0] as LngLatLike,
      reversedPolyline[0] as LngLatLike
    )
  );

  return (
    <div style={{ height: "100vh" }}>
      <ReactMapGL
        initialViewState={{
          bounds,
          fitBoundsOptions: {
            padding: 60,
          },
        }}
        mapLib={import("mapbox-gl")}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
        preserveDrawingBuffer={true}
      >
        <Source
          type="geojson"
          id="mapbox"
          data={{
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: reversedPolyline,
            },
            properties: {},
          }}
        >
          <Layer
            id="route"
            type="line"
            source="mapbox"
            layout={{
              "line-join": "round",
              "line-cap": "round",
            }}
            paint={{
              "line-color": "#fc5201",
              "line-width": 3,
            }}
          />
        </Source>
      </ReactMapGL>
    </div>
  );
};

export default ActivityMap;
