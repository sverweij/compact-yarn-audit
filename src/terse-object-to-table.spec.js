import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { deepEqual } from "node:assert";
import chalk from "chalk";
import { terseAdvisoryLog2Table } from "./terse-advisory-to-table.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("terse-object-to-table - smoke test", () => {
  let chalkLevel = chalk.level;

  before("disable chalk coloring", () => {
    chalk.level = 0;
  });

  after("put chalk color level back to its original value", () => {
    chalk.level = chalkLevel;
  });

  it("transforms a terse object to a table (terminal has 125 columns available)", () => {
    deepEqual(
      terseAdvisoryLog2Table(
        JSON.parse(
          readFileSync(
            join(__dirname, "__fixtures__", "sample-output.terselog.json"),
            "utf8"
          )
        ),
        125
      ),
      readFileSync(
        join(__dirname, "__fixtures__", "sample-output.table.txt"),
        "utf8"
      )
    );
  });

  it("transforms a terse object to a table (terminal has 1000 columns available)", () => {
    deepEqual(
      terseAdvisoryLog2Table(
        JSON.parse(
          readFileSync(
            join(__dirname, "__fixtures__", "sample-output.terselog.json"),
            "utf8"
          )
        ),
        1000
      ),
      readFileSync(
        join(__dirname, "__fixtures__", "sample-output.wide-table.txt"),
        "utf8"
      )
    );
  });
});
