import { readFileSync } from "node:fs";
import { deepEqual } from "node:assert/strict";
import { describe, it } from "node:test";
import { terseAdvisoryLog2Table } from "./terse-advisory-to-table.js";

describe("terse-object-to-table - smoke test", () => {
  it("transforms a terse object to a table (terminal has 125 columns available)", () => {
    deepEqual(
      terseAdvisoryLog2Table(
        JSON.parse(
          readFileSync(
            new URL(
              "__fixtures__/sample-output.terselog.json",
              import.meta.url,
            ),
            "utf8",
          ),
        ),
        125,
      ),
      readFileSync(
        new URL("__fixtures__/sample-output.table.txt", import.meta.url),
        "utf8",
      ),
    );
  });

  it("transforms a terse object to a table (terminal has 1000 columns available)", () => {
    deepEqual(
      terseAdvisoryLog2Table(
        JSON.parse(
          readFileSync(
            new URL(
              "__fixtures__/sample-output.terselog.json",
              import.meta.url,
            ),
            "utf8",
          ),
        ),
        1000,
      ),
      readFileSync(
        new URL("__fixtures__/sample-output.wide-table.txt", import.meta.url),
        "utf8",
      ),
    );
  });
});
