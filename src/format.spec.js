import { match } from "node:assert";
import format from "./format.js";

describe("format - smoke test", () => {
  it("emits a message conveying there's no vulnerabilities when the # of terse entries === 0", () => {
    match(format([]), /no vulnerabilities found/);
  });

  it("emits a table when the # of terse entries > 0", () => {
    /** @type {import("../types/compact-yarn-audit").ITerseEntry[]} */
    const lTerseEntries = [
      {
        severity: "critical",
        title: "rotten fish is smelly",
        module_name: "rotten-fish",
        via: "fish-market",
        fixable: true,
        fixString: "buy fresh fish",
      },
    ];

    match(format(lTerseEntries), /severity/);
    match(format(lTerseEntries), /title/);
  });
});
