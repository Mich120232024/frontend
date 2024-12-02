import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Check if the root element exists
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element not found! Ensure your HTML file has a div with id 'root'."
  );
}

// Create the root React container
const root = ReactDOM.createRoot(rootElement);

// Render the React app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Function to measure performance metrics
if (process.env.NODE_ENV === "development") {
  import("./reportWebVitals").then(({ default: reportWebVitals }) =>
    reportWebVitals(console.log)
  );
}
