import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const initialVolSurfaceData = {
  gridX: [],
  gridY: [],
  gridVol: [],
};

root.render(
  <React.StrictMode>
    <App volSurfaceData={initialVolSurfaceData} />
  </React.StrictMode>
);
