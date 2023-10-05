// pages/_app.tsx
import React from "react";
import { AppProps } from "next/app";
import { GlobalStateProvider } from "../context/GlobalStateContext";

import "./globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <GlobalStateProvider>
      <Component {...pageProps} />
    </GlobalStateProvider>
  );
};

export default MyApp;
