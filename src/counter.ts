/**
 * A utility function to set up a counter on an HTML button element.
 * Each click on the button increments the counter and updates the button's label.
 *
 * @param element - The HTML button element to attach the counter logic.
 */
export function setupCounter(element: HTMLButtonElement): void {
  let counter = 0; // Initialize the counter variable

  // Function to update the counter and set the button's text
  const setCounter = (count: number): void => {
    counter = count;
    element.textContent = `Count is ${counter}`;
  };

  // Attach a click event listener to increment the counter
  element.addEventListener("click", () => setCounter(counter + 1));

  // Initialize the counter display
  setCounter(0);
}
