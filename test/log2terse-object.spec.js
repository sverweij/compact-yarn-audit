import { fileURLToPath } from "url";
import { expect } from "chai";
import {
  sortLog,
  extractUsefulAttributes,
} from "../src/log-to-terse-object.js";
import { readFileSync } from "fs";
import { join } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("log-to-terse-object - smoke test", () => {
  it("sorts and deduplicates log entries", () => {
    const lLog = readFileSync(
      join(__dirname, "sample-output.jsonstream"),
      "utf8"
    )
      .split(`\n`)
      .filter((pString) => pString)
      .map((pString) => JSON.parse(pString))
      .filter((pLogEntry) => pLogEntry.type === "auditAdvisory")
      .map(extractUsefulAttributes);

    expect(sortLog(lLog)).to.deep.equal(
      JSON.parse(
        readFileSync(join(__dirname, "sample-output.terselog.json"), "utf8")
      )
    );
  });
});
