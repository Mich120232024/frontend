import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Volatility Surface Visualizer", () => {
  render(<App />);
  const element = screen.getByText(/Volatility Surface Visualizer/i);
  expect(element).toBeInTheDocument(); // Uses a matcher from jest-dom
});
