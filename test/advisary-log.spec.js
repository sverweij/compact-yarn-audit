import { fileURLToPath } from "url";
import { expect } from "chai";
import { readFileSync } from "fs";
import { join } from "path";
import { TerseAdvisoryLog } from "../src/terse-advisory-log.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("log-to-terse-object - smoke test", () => {
  it("sorts and deduplicates log entries", () => {
    const lAdvisaryLog = new TerseAdvisoryLog();

    readFileSync(join(__dirname, "sample-output.jsonstream"), "utf8")
      .split(`\n`)
      .filter((pString) => pString)
      .map((pString) => JSON.parse(pString))
      .forEach((pLogEntry) => {
        lAdvisaryLog.add(pLogEntry);
      });

    expect(lAdvisaryLog.get()).to.deep.equal(
      JSON.parse(
        readFileSync(join(__dirname, "sample-output.terselog.json"), "utf8")
      )
    );
  });
});
