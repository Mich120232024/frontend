import React, { useState } from "react";
import axios from "axios";
import VolSurfaceVisualizer from "./VolSurfaceVisualizer";
import "./style.css";

interface VolSurfaceData {
  gridX: number[][];
  gridY: number[][];
  gridVol: number[][];
}

const App: React.FC = () => {
  const [volSurfaceData, setVolSurfaceData] = useState<VolSurfaceData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVolSurface = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<VolSurfaceData>(
        "http://127.0.0.1:5000/api/vol-surface",
        {
          tradeCurrency: "EUR",
          settlementCurrency: "USD",
        }
      );
      console.log("API Response:", response.data);
      setVolSurfaceData(response.data);
    } catch (err: unknown) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch volatility surface data");
    } finally {
      setLoading(false);
    }
  };

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
      {error && <p style={{ color: "red" }}>{error}</p>}
      {volSurfaceData ? (
        <VolSurfaceVisualizer volSurfaceData={volSurfaceData} />
      ) : (
        <VolSurfaceVisualizer volSurfaceData={dummyVolSurfaceData} />
      )}
    </div>
  );
};

export default App;
