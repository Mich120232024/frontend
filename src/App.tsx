import React, { useState, useEffect } from "react";
import axios from "axios";
import VolSurfaceVisualizer from "./VolSurfaceVisualizer";
import "./style.css";

interface VolSurfaceData {
  gridX: number[][];
  gridY: number[][];
  gridVol: number[][];
}

interface AppProps {
  volSurfaceData: VolSurfaceData;
}

const App: React.FC<AppProps> = ({ volSurfaceData: initialVolSurfaceData }) => {
  const [volSurfaceData, setVolSurfaceData] = useState<VolSurfaceData | null>(
    initialVolSurfaceData
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
          fixingDate: "2023-01-01", // Example date
        }
      );
      setVolSurfaceData(response.data);
    } catch (err: any) {
      console.error("Error fetching data:", err.message);
      setError("Failed to fetch volatility surface data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolSurface();
  }, []);

  return (
    <div className="App">
      <h1>Volatility Surface Visualizer</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {volSurfaceData && (
        <VolSurfaceVisualizer volSurfaceData={volSurfaceData} />
      )}
    </div>
  );
};

export default App;
