import { readFileSync } from "node:fs";
import { deepStrictEqual } from "node:assert";
import { TerseAdvisoryLog } from "./terse-advisory-log.js";

describe("log-to-terse-object - smoke test", () => {
  it("sorts and de-duplicates log entries", () => {
    const lAdvisoryLog = new TerseAdvisoryLog();

    readFileSync(
      new URL("__mocks__/sample-output.jsonstream", import.meta.url),
      "utf8"
    )
      .split(`\n`)
      .filter(Boolean)
      .map((pString) => JSON.parse(pString))
      .forEach((pLogEntry) => {
        lAdvisoryLog.add(pLogEntry);
      });

    deepStrictEqual(
      lAdvisoryLog.get(),
      JSON.parse(
        readFileSync(
          new URL("__fixtures__/sample-output.terselog.json", import.meta.url),
          "utf8"
        )
      )
    );
  });
});
