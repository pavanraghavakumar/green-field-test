import { useState } from "react";

import { saveCalculation } from "../api.js";
import styles from "./CalculatorScreen.module.css";

// The keypad, in the order of the design's 4-column grid: `C`, `÷`, `×`, `−`
// on the first row, then `7 8 9 +`, `4 5 6` with `=` spanning two rows, and
// `1 2 3` and `0 .` on the last rows.
const KEYPAD = [
  { label: "C", kind: "clear" },
  { label: "÷", kind: "operator" },
  { label: "×", kind: "operator" },
  { label: "−", kind: "operator" },
  { label: "7", kind: "digit" },
  { label: "8", kind: "digit" },
  { label: "9", kind: "digit" },
  { label: "+", kind: "operator" },
  { label: "4", kind: "digit" },
  { label: "5", kind: "digit" },
  { label: "6", kind: "digit" },
  { label: "=", kind: "equals" },
  { label: "1", kind: "digit" },
  { label: "2", kind: "digit" },
  { label: "3", kind: "digit" },
  { label: "0", kind: "digit" },
  { label: ".", kind: "digit" },
];

const DIGITS = new Set(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
const OPERATORS = new Set(["+", "−", "×", "÷"]);

const DIVISION_BY_ZERO = "Division by zero is not allowed";
const NOT_SAVED = "Calculation not saved";
const ENTER_A_NUMBER = "Enter a number to calculate";

// The display shows a whole number without a trailing ".0", and a decimal
// result with the precision the arithmetic gives it.
function formatResult(value) {
  if (!Number.isFinite(value)) {
    return String(value);
  }
  return String(Number(value.toFixed(10)));
}

/**
 * The calculator: the display, the keypad and the message line.
 *
 * It keeps the first number, the chosen operator and the second number in
 * state. Digits append to the display, an operator keeps the first number and
 * empties the display, `=` calls `saveCalculation` and shows the result, and
 * `C` empties the display and forgets the first number and the operator.
 *
 * @param {{
 *   onSaved?: (calculation: object) => void,
 *   onSaveFailed?: () => void,
 * }} props
 */
export default function CalculatorScreen({ onSaved, onSaveFailed } = {}) {
  const [display, setDisplay] = useState("");
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function handleDigit(label) {
    setMessage("");
    setDisplay((current) => {
      if (label === ".") {
        if (current.includes(".")) {
          return current;
        }
        return current === "" ? "0." : `${current}.`;
      }
      // A leading zero is replaced by the next digit, so "0" then "5" is "5".
      if (current === "0") {
        return label;
      }
      return `${current}${label}`;
    });
  }

  function handleOperator(label) {
    setMessage("");
    if (display !== "") {
      setFirstNumber(Number(display));
      setOperator(label);
      setDisplay("");
      return;
    }
    // No second number typed yet: the operator can still be changed.
    if (firstNumber !== null) {
      setOperator(label);
    }
  }

  function handleClear() {
    setDisplay("");
    setFirstNumber(null);
    setOperator(null);
    setMessage("");
  }

  async function handleEquals() {
    if (firstNumber === null || operator === null || display === "") {
      setMessage(ENTER_A_NUMBER);
      return;
    }

    const left = firstNumber;
    const right = Number(display);
    setBusy(true);
    setMessage("");

    try {
      const saved = await saveCalculation({ left, operator, right });
      const result = saved && typeof saved.result === "number" ? saved.result : null;
      setDisplay(formatResult(result === null ? calculate(left, operator, right) : result));
      setFirstNumber(null);
      setOperator(null);
      if (onSaved) {
        onSaved(saved);
      }
    } catch (error) {
      if (error && error.message === DIVISION_BY_ZERO) {
        setDisplay(DIVISION_BY_ZERO);
        setFirstNumber(null);
        setOperator(null);
        return;
      }
      // The API refused the calculation itself: keep the display as it was.
      if (error && error.status === 400) {
        setMessage(error.message || ENTER_A_NUMBER);
        return;
      }
      // The save failed: still show the result, and say it was not saved.
      setDisplay(formatResult(calculate(left, operator, right)));
      setFirstNumber(null);
      setOperator(null);
      setMessage(NOT_SAVED);
      if (onSaveFailed) {
        onSaveFailed();
      }
    } finally {
      setBusy(false);
    }
  }

  function handleKey(label, kind) {
    if (busy) {
      return;
    }
    if (kind === "digit") {
      handleDigit(label);
    } else if (kind === "operator") {
      handleOperator(label);
    } else if (kind === "equals") {
      handleEquals();
    } else if (kind === "clear") {
      handleClear();
    }
  }

  const isProblem = message !== "" && message !== NOT_SAVED;

  return (
    <section className={styles.card} aria-label="Calculator">
      <output
        className={styles.display}
        data-testid="calculator-display"
        aria-live="polite"
      >
        {display}
      </output>

      <p
        className={`${styles.message} ${isProblem ? styles.messageError : ""}`}
        role="status"
      >
        {message}
      </p>

      <div className={styles.keypad}>
        {KEYPAD.map(({ label, kind }) => (
          <button
            key={label}
            type="button"
            className={`${styles.key} ${styles[kind]}`}
            onClick={() => handleKey(label, kind)}
            disabled={busy}
            aria-label={ariaLabelFor(label, kind)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function ariaLabelFor(label, kind) {
  if (kind === "clear") {
    return "Clear";
  }
  if (kind === "equals") {
    return "Equals";
  }
  if (kind === "operator") {
    return `Operator ${label}`;
  }
  return label === "." ? "Decimal point" : label;
}

// The result the API would give, used only when the save fails so the display
// still shows the answer.
function calculate(left, operator, right) {
  switch (operator) {
    case "+":
      return left + right;
    case "−":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? NaN : left / right;
    default:
      return NaN;
  }
}

export { DIGITS, OPERATORS };
