import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { deepEqual } from "node:assert";
import { TerseAdvisoryLog } from "./terse-advisory-log.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("log-to-terse-object - smoke test", () => {
  it("sorts and de-duplicates log entries", () => {
    const lAdvisoryLog = new TerseAdvisoryLog();

    readFileSync(
      join(__dirname, "__mocks__", "sample-output.jsonstream"),
      "utf8"
    )
      .split(`\n`)
      .filter(Boolean)
      .map((pString) => JSON.parse(pString))
      .forEach((pLogEntry) => {
        lAdvisoryLog.add(pLogEntry);
      });

    deepEqual(
      lAdvisoryLog.get(),
      JSON.parse(
        readFileSync(
          join(__dirname, "__fixtures__", "sample-output.terselog.json"),
          "utf8"
        )
      )
    );
  });
});
