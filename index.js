/**
 * index.js - Lab 9: JavaScript Error Handling
 * Name: Allison Lian
 *
 * Demonstrates console methods, try/catch/finally, custom errors, global error handling, and TrackJS monitoring.
 */

// Section 1: Global Error Handler

window.addEventListener("error", function (event) {
  //Build structured report from the error event's properties
  const errorReport = {
    message: event.message,
    source: event.filename,
    line: event.lineno,
    column: event.colno,
    errorType: event.error ? event.error.name : "Unknown",
    stack: event.error ? event.error.stack : "No stack trace",
    timestamp: new Date().toISOString(),
    pageUrl: this.window.location.href,
  };

  console.group("Global Error Handler Caught an Error");
  console.error("Message:", errorReport.message);
  console.error(
    "Location:",
    `Line ${errorReport.line}, Column ${errorReport.column}`,
  );
  console.error("Type:", errorReport.errorType);
  console.error("Stack:", errorReport.stack);
  console.error("Full Report Object:", errorReport);
  console.log("(In production this would be sent to a server via fetch)");
  console.groupEnd();
});

// Section 2: Custom Error Classes

/**
 * ValidationError - thrown when user input fails validation.
 * Adds a "field" property to identify which input was bad.
 */
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * DivisionByZeroError - thrown specifically when dividing by zero.
 * Extends specifically when dividing by zero.
 */
class DivisionByZeroError extends Error {
  constructor(numerator) {
    super(`Cannot divide ${numerator} by zero`);
    this.name = "DivisionByZeroError";
    this.numerator = numerator;
    this.timestamp = new Date().toISOString();
  }
}

// Section 3: Calculator Form with Try/Catch/Finally

let form = document.querySelector("form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const output = document.querySelector("output");
  const firstNum = document.querySelector("#first-num").value;
  const secondNum = document.querySelector("#second-num").value;
  const operator = document.querySelector("#operator").value;

  // Clear previous result
  output.innerHTML = "";
  output.style.color = "black";

  try {
    if (firstNum.trim() === "") {
      throw new ValidationError("First number cannot be empty", "first-num");
    }
    if (secondNum.trim() === "") {
      throw new ValidationError("Second number cannot be empty", "second-num");
    }

    if (isNaN(firstNum)) {
      throw new ValidationError(
        `"${firstNum}" is not a valid number`,
        "first-num",
      );
    }

    if (isNaN(secondNum)) {
      throw new ValidationError(
        `"${secondNum}" is not a valid number`,
        "second-num",
      );
    }

    if (operator === "/" && Number(secondNum) === 0) {
      throw new DivisionByZeroError(firstNum);
    }

    const result = eval(`${firstNum} ${operator} ${secondNum}`);

    output.innerHTML = result;
    console.log(`Calculated: ${firstNum} ${operator} ${secondNum} = ${result}`);
  } catch (error) {
    output.style.color = "red";
    if (error instanceof ValidationError) {
      output.innerHTML = `Validation: ${error.message}`;
      console.error(
        `[ValidationError] Field "${error.field}": ${error.message}`,
      );
      console.error("Timestamp:", error.timestamp);
    } else if (error instanceof DivisionByZeroError) {
      output.innerHTML = `Math Error: ${error.message}`;
      console.error(`[DivisionByZeroError] Numerator was: ${error.numerator}`);
      console.error("Timestamp:", error.timestamp);
    } else if (error instanceof SyntaxError) {
      output.innerHTML = "Syntax error in expression";
      console.error("[SyntaxError from eval]:", error.message);
    } else {
      output.innerHTML = "Unexpected error occurred";
      console.error("[Unknown Error]:", error);
    }
  } finally {
    console.log(
      `Calculator finished processing: ${firstNum} ${operator} ${secondNum}`,
    );
  }
});

// Section 4: Console Method Buttons

let errorBtns = Array.from(document.querySelectorAll("#error-btns > button"));

errorBtns[0].addEventListener("click", function () {
  console.log("=== Console Log Demo ===");

  // 1. Log simple values of different types
  console.log("String value:", "Hello from Lab 9");
  console.log("Number value:", 42);
  console.log("Boolean value:", true);
  console.log("Array value:", [1, 2, 3, 4, 5]);

  // 2. Log an object — shows as expandable tree in DevTools
  const labInfo = {
    lab: 0,
    topic: "Error Handling",
    author: "Allison Lian",
    concepts: ["console", "try/catch", "custom errors", "TrackJS"],
  };

  console.log("Object:", labInfo);

  // 3. Multiple arguments — prints space-separated
  console.log("Lab", 9, "is about", "error handling");

  // 4. String substitution with %s (string) and %d (number)
  console.log("Lab %d topic: %s", labInfo.lab, labInfo.topic);

  // 5. Styled output with %c (applies CSS to the following text)
  console.log(
    "%cStyled console.log!",
    "color: blue; font-size: 16px; font-weight: bold;",
  );
});

// Index 1: Console Error
errorBtns[1].addEventListener("click", function () {
  console.error("=== Console Error Demo ===");

  console.error("Something went wrong!");

  const err = new Error("Simulated application error");
  console.error("Error object:", err);

  console.log("Same message via console.log (no red styling, no stack)");
  console.error("Same message via console.error (red, with stack trace)");

  try {
    null.accessProperty;
  } catch (caughtError) {
    console.error("Caught error type:", caughtError.name);
    console.error("Caught error message:", caughtError.message);
    console.error("Full caught error:", caughtError);
  }
});

// Index 2: Console Count
errorBtns[2].addEventListener("click", function () {
  console.count("button-clicks");
  console.count("button-clicks");
  console.count("button-clicks");

  console.count("counter-A");
  console.count("counter-B");
  console.count("counter-A");

  console.log("Click this button multiple times to see count increase");

  console.countReset("counter-A");
  console.count("counter-A");
  console.log("counter-A was reset and is now back at 1");
});

// Index 3: Console Warn
errorBtns[3].addEventListener("click", function () {
  console.warn("=== Console Warn Demo ===");

  console.warn(
    "DEPRECATION WARNING: eval() usage detected. " +
      "Consider using safer alternatives.",
  );

  const itemCount = 15000;
  if (itemCount > 10000) {
    console.warn(
      `Performance warning: rendering ${itemCount} items may be slow`,
    );
  }

  const config = { debugMode: true, apiUrl: "" };
  if (!config.apiUrl) {
    console.warn("Config warning: apiUrl is empty — using default endpoint");
  }
  if (config.debugMode) {
    console.warn(
      "Config warning: debugMode is enabled — disable before production",
    );
  }

  console.warn("Suspicious input detected:", { value: "DROP TABLE users;" });
});

// Index 4: Console Assert
errorBtns[4].addEventListener("click", function () {
  console.log("=== Console Assert Demo ===");

  const x = 8;
  const y = 10;
  const username = "Olivia";
  const items = [6, 2, 8];

  console.assert(x < y, "x should be less than y");
  console.assert(username.length > 0, "Username should not be empty");
  console.assert(items.length > 0, "Items array should not be empty");
  console.log("Above asserts passed — nothing logged (conditions were true)");

  console.assert(x > y, "FAIL: x is NOT greater than y");
  console.assert(
    username === "Bob",
    "FAIL: username is not Bob, it is:",
    username,
  );
  console.assert(
    items.length > 10,
    "FAIL: items array has fewer than 10 items",
  );

  const realElement = document.querySelector("form");
  const missingElement = document.querySelector("#does-not-exist");

  console.assert(realElement !== null, "form element should exist in DOM");
  console.assert(
    missingElement != null,
    "FAIL: #does-not-exist is not in the DOM — check your HTML",
  );
});

// Index 5: Console Clear
errorBtns[5].addEventListener("click", function () {
  console.log("You will not see this after the clear...");
  console.log("Clearing console in 1 second...");

  setTimeout(function () {
    console.clear();
    console.log("Console was cleared! Fresh start.");
    console.log('(Some browsers show "Console was cleared" message above)');
  }, 1000);
});

// Index 6: Console Dir
errorBtns[6].addEventListener("click", function () {
  console.log("=== Console Dir Demo ===");

  const formElement = document.querySelector("form");

  console.log("console.LOG of form element (shows HTML):");
  console.log(formElement);

  console.log("console.DIR of form element (shows JS object):");
  console.dir(formElement);

  console.log("console.DIR of the console object itself:");
  console.dir(console);

  console.dir(Array);
});

// Index 7: Console Dirxml
errorBtns[7].addEventListener("click", function () {
  console.log("=== Console Dirxml Demo ===");

  console.log("Dirxml of form element:");
  console.dirxml(document.querySelector("form"));

  console.log("Dirxml of error buttons section:");
  console.dirxml(document.querySelector("#error-btns"));

  console.log("Dirxml of a plain object (falls back to dir):");
  console.dirxml({ name: "test", value: 42 });
});

// Index 8: Console Group Start
errorBtns[8].addEventListener("click", function () {
  console.group("Outer Group (click triangle to collapse)");
  console.log("This log is inside the outer group");
  console.log("All logs are indented under the group label");

  console.group("Inner Group (nested)");
  console.log("This is nested inside the inner group");
  console.warn("Warnings get grouped too");
  console.error("Errors get grouped too");
  console.groupEnd();

  console.groupCollapsed("Collapsed Group (starts closed)");
  console.log("You have to click the arrow to see this");
  console.table([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
  console.groupEnd();

  console.log("Back in the outer group after inner groups closed");
  console.groupEnd();

  console.log('Click "Console Group End" button to see groupEnd in action');
});

// Index 9: Console Group End
errorBtns[9].addEventListener("click", function () {
  console.log("=== Console Group End Demo ===");

  console.group("Request Lifecycle");
  console.log("1. Validate inputs");
  console.log("2. Build request");

  console.group("3. Send request");
  console.log("Connecting to server...");
  console.log("Awaiting response...");
  console.log("Response received");
  console.groupEnd();

  console.log("4. Process response");
  console.log("5. Update UI");
  console.groupEnd();

  console.log("All groups properly closed — no indentation bleeding");
});

// Index 10: Console Table

errorBtns[10].addEventListener("click", function () {
  console.log("=== Console Table Demo ===");

  const students = [
    { name: "Alice", grade: "A", score: 95, lab9Done: true },
    { name: "Bob", grade: "B", score: 83, lab9Done: true },
    { name: "Charlie", grade: "C", score: 71, lab9Done: false },
    { name: "Diana", grade: "A", score: 97, lab9Done: true },
  ];

  console.log("Full student table:");
  console.table(students);

  console.log("Only name and score columns:");
  console.table(students, ["name", "score"]);

  console.log("Simple array:");
  console.table([
    "console.log",
    "console.error",
    "console.table",
    "console.dir",
  ]);

  const calcData = [
    {
      firstNum: document.querySelector("#first-num").value || "(empty)",
      operator: document.querySelector("#operator").value,
      secondNum: document.querySelector("#second-num").value || "(empty)",
    },
  ];
  console.log("Current calculator values:");
  console.table(calcData);
});

// Index 11: Start Timer
errorBtns[11].addEventListener("click", function () {
  console.log("=== Timer Started ===");
  console.time("lab9-timer");

  console.time("sort-operation");

  const bigArray = Array.from({ length: 500000 }, () => Math.random());
  bigArray.sort((a, b) => a - b);

  console.timeEnd("sort-operation");

  console.timeLog("lab9-timer", "after sort operation");

  console.log('lab9-timer is still running — click "End Timer" to stop it');
  console.log("Try doing some work before clicking End Timer");
});

// Index 12: End Timer
errorBtns[12].addEventListener("click", function () {
  console.timeEnd("lab9-timer");
  console.log("Timer ended — the elapsed time is shown above");
  console.log(
    "If you see a warning about timer not existing, click Start Timer first",
  );
});

// Indedx 13: Console Trace
errorBtns[13].addEventListener("click", function () {
  console.log("=== Console Trace Demo ===");

  traceStepOne();
});

function traceStepOne() {
  console.log("Inside traceStepOne — calling traceStepTwo");
  traceStepTwo();
}

function traceStepTwo() {
  console.log("Inside traceStepTwo — calling traceStepThree");
  traceStepThree();
}

function traceStepThree() {
  console.trace("How did execution reach traceStepThree?");

  console.log(
    "The stack trace above shows the complete call chain. " +
      'This is invaluable for debugging "how did I get here?" questions.',
  );
}

// Index 14: Trigger Global Error
errorBtns[14].addEventListener("click", function () {
  console.log("Triggering a global (uncaught) error in 1 second...");
  console.log(
    "Watch the global error handler at the top of this file catch it",
  );
  console.log("Also watch your TrackJS dashboard — it should appear there too");

  setTimeout(function () {
    const obj = undefined;
    obj.triggerGlobalError;
  }, 1000);
});
