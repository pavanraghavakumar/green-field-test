import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App.jsx";

describe("App", () => {
  it("shows the calculator page at /", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Calculator" })).toBeInTheDocument();
  });
});
