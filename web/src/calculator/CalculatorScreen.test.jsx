import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CalculatorScreen from "./CalculatorScreen.jsx";
import { saveCalculation } from "../api.js";

// The API calls are mocked: no request leaves the test.
vi.mock("../api.js", () => ({
  saveCalculation: vi.fn(),
  loadHistory: vi.fn(),
}));

function display() {
  return screen.getByTestId("calculator-display");
}

function key(name) {
  return screen.getByRole("button", { name });
}

async function press(user, ...names) {
  for (const name of names) {
    await user.click(key(name));
  }
}

// The API answers with the saved row, as the real one does.
function answerWith(result) {
  saveCalculation.mockImplementation(async ({ left, operator, right }) => ({
    id: 1,
    expression: `${left} ${operator} ${right}`,
    result,
    created_at: "2026-11-01T08:15:00+00:00",
  }));
}

describe("CalculatorScreen", () => {
  beforeEach(() => {
    saveCalculation.mockReset();
  });

  it("shows the display above a keypad of digits, operators, equals and clear", () => {
    render(<CalculatorScreen />);

    expect(display()).toBeInTheDocument();

    for (const digit of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) {
      expect(key(digit)).toBeInTheDocument();
    }
    expect(key("Decimal point")).toBeInTheDocument();
    expect(key("Operator +")).toBeInTheDocument();
    expect(key("Operator −")).toBeInTheDocument();
    expect(key("Operator ×")).toBeInTheDocument();
    expect(key("Operator ÷")).toBeInTheDocument();
    expect(key("Equals")).toBeInTheDocument();
    expect(key("Clear")).toBeInTheDocument();
  });

  it("adds each digit to the display in the order clicked", async () => {
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "1", "2", "3");

    expect(display()).toHaveTextContent("123");
  });

  it("keeps the first number and empties the display when an operator is clicked", async () => {
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "7", "Operator ×");

    expect(display()).toHaveTextContent("");

    await press(user, "8");
    expect(display()).toHaveTextContent("8");
  });

  it("shows 5 for 2 + 3", async () => {
    answerWith(5);
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "2", "Operator +", "3", "Equals");

    await waitFor(() => expect(display()).toHaveTextContent("5"));
    expect(saveCalculation).toHaveBeenCalledWith({ left: 2, operator: "+", right: 3 });
  });

  it("shows 56 for 7 × 8", async () => {
    answerWith(56);
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "7", "Operator ×", "8", "Equals");

    await waitFor(() => expect(display()).toHaveTextContent("56"));
    expect(saveCalculation).toHaveBeenCalledWith({ left: 7, operator: "×", right: 8 });
  });

  it("shows 5 for 9 − 4", async () => {
    answerWith(5);
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "9", "Operator −", "4", "Equals");

    await waitFor(() => expect(display()).toHaveTextContent("5"));
    expect(saveCalculation).toHaveBeenCalledWith({ left: 9, operator: "−", right: 4 });
  });

  it("shows 4 for 8 ÷ 2", async () => {
    answerWith(4);
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "8", "Operator ÷", "2", "Equals");

    await waitFor(() => expect(display()).toHaveTextContent("4"));
    expect(saveCalculation).toHaveBeenCalledWith({ left: 8, operator: "÷", right: 2 });
  });

  it("empties the display and forgets the first number and the operator on clear", async () => {
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "9", "Operator +", "Clear");

    expect(display()).toHaveTextContent("");

    // The first number and the operator are gone: equals has nothing to do.
    await press(user, "Equals");
    expect(saveCalculation).not.toHaveBeenCalled();
  });

  it("shows the division-by-zero message on the display and saves nothing", async () => {
    saveCalculation.mockRejectedValue(new Error("Division by zero is not allowed"));
    const user = userEvent.setup();
    render(<CalculatorScreen />);

    await press(user, "5", "Operator ÷", "0", "Equals");

    await waitFor(() =>
      expect(display()).toHaveTextContent("Division by zero is not allowed"),
    );
    expect(saveCalculation).toHaveBeenCalledTimes(1);
  });

  it("keeps the result and says it was not saved when the save fails", async () => {
    saveCalculation.mockRejectedValue(new Error("Network error"));
    const onSaveFailed = vi.fn();
    const user = userEvent.setup();
    render(<CalculatorScreen onSaveFailed={onSaveFailed} />);

    await press(user, "7", "Operator ×", "8", "Equals");

    await waitFor(() => expect(display()).toHaveTextContent("56"));
    expect(screen.getByText("Calculation not saved")).toBeInTheDocument();
    expect(onSaveFailed).toHaveBeenCalled();
  });
});
