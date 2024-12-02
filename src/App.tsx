import React, { useState } from "react";
import axios from "axios";
import VolSurfaceVisualizer from "./VolSurfaceVisualizer";
import "./style.css";

// Define an interface for the volatility surface data
interface VolSurfaceData {
  gridX: number[][];
  gridY: number[][];
  gridVol: number[][];
}

const App: React.FC = () => {
  // State for volatility surface data, loading, and error messages
  const [volSurfaceData, setVolSurfaceData] = useState<VolSurfaceData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch the volatility surface data from the backend
  const fetchVolSurface = async () => {
    setLoading(true); // Set loading state to true
    setError(null); // Clear any previous error messages

    try {
      // Make a POST request to the backend API
      const response = await axios.post<VolSurfaceData>(
        "http://127.0.0.1:5000/api/vol-surface",
        {
          tradeCurrency: "EUR", // Hardcoded filter for EUR/USD
          settlementCurrency: "USD",
        }
      );
      console.log("API Response:", response.data);
      setVolSurfaceData(response.data); // Update the state with fetched data
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch volatility surface data"); // Set error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Dummy data to display when no actual data is available
  const dummyVolSurfaceData: VolSurfaceData = {
    gridX: [
      [0, 1, 2],
      [0, 1, 2],
    ],
    gridY: [
      [0, 0, 0],
      [1, 1, 1],
    ],
    gridVol: [
      [5, 6, 7],
      [8, 9, 10],
    ],
  };

  return (
    <div className="App">
      <h1>Volatility Surface Visualizer</h1>
      <button onClick={fetchVolSurface} disabled={loading}>
        {loading ? "Fetching Data..." : "Fetch Most Recent EUR/USD Fixing"}
      </button>

      {/* Show an error message if present */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Render the VolSurfaceVisualizer with fetched or dummy data */}
      <VolSurfaceVisualizer
        volSurfaceData={volSurfaceData || dummyVolSurfaceData}
      />
    </div>
  );
};

export default App;
