// The two calls to the API: save a calculation and read the history.
//
// Both answer with the parsed JSON body. A refused request (a 4xx or 5xx
// answer) throws an Error carrying the API's message, so a caller can show it
// as it is, such as "Division by zero is not allowed".

const API_BASE = "/api";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(path, options) {
  const response = await fetch(`${API_BASE}${path}`, options);
  const body = await readJson(response);

  if (!response.ok) {
    const message =
      body && typeof body.error === "string"
        ? body.error
        : "The calculation could not be completed";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return body;
}

/**
 * Save a calculation and get the saved row back.
 *
 * @param {{ left: number, operator: string, right: number }} calculation
 * @returns {Promise<{ id: number, expression: string, result: number, created_at: string }>}
 */
export function saveCalculation({ left, operator, right }) {
  return request("/calculations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ left, operator, right }),
  });
}

/**
 * Read the saved calculations, newest first.
 *
 * @returns {Promise<Array<{ id: number, expression: string, result: number, created_at: string }>>}
 */
export function loadHistory() {
  return request("/history", { method: "GET" });
}
