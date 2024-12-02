import { render, screen } from "@testing-library/react";
import App from "./App";
import "@testing-library/jest-dom";

test("renders Volatility Surface Visualizer", () => {
  render(<App />);
  const headingElement = screen.getByText(/Volatility Surface Visualizer/i);
  expect(headingElement).toBeInTheDocument();
});
