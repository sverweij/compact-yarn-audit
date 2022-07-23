import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { join } from "path";
import { expect } from "chai";
import chalk from "chalk";
import { TerseAdvisoryLog2Table } from "../src/terse-advisory-to-table.js";

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
    expect(
      TerseAdvisoryLog2Table(
        JSON.parse(
          readFileSync(
            join(__dirname, "__fixtures__", "sample-output.terselog.json"),
            "utf8"
          )
        ),
        125
      )
    ).to.deep.equal(
      readFileSync(
        join(__dirname, "__fixtures__", "sample-output.table.txt"),
        "utf8"
      )
    );
  });

  it("transforms a terse object to a table (terminal has 1000 columns available)", () => {
    expect(
      TerseAdvisoryLog2Table(
        JSON.parse(
          readFileSync(
            join(__dirname, "__fixtures__", "sample-output.terselog.json"),
            "utf8"
          )
        ),
        1000
      )
    ).to.deep.equal(
      readFileSync(
        join(__dirname, "__fixtures__", "sample-output.wide-table.txt"),
        "utf8"
      )
    );
  });
});
