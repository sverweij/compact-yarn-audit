import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { join } from "path";
import { expect } from "chai";
import chalk from "chalk";
import { terseLog2Table } from "../src/terse-object-to-table.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("terse-object-to-table - smoke test", () => {
  let chalkLevel = chalk.level;

  before("disable chalk coloring", () => {
    chalk.level = 0;
  });

  after("put chalk color level back to its original value", () => {
    chalk.level = chalkLevel;
  });

  it("transforms a terse object to a table", () => {
    expect(
      terseLog2Table(
        JSON.parse(
          readFileSync(join(__dirname, "sample-output.terselog.json"), "utf8")
        )
      )
    ).to.deep.equal(
      readFileSync(join(__dirname, "sample-output.table.txt"), "utf8")
    );
  });
});
