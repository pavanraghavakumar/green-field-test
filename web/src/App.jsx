// The page: the calculator and the history list, side by side on a desktop and
// one above the other on a phone.
import CalculatorScreen from "./calculator/CalculatorScreen.jsx";

export default function App() {
  return (
    <main className="app">
      <h1 className="app__title">Calculator</h1>
      <CalculatorScreen />
    </main>
  );
}
