import { fileURLToPath } from "url";
import { expect } from "chai";
import { terseLog } from "../src/log-to-terse-object.js";
import { readFileSync } from "fs";
import { join } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

describe("log-to-terse-object - smoke test", () => {
  it("extracts the attributes of interest in an object", () => {
    expect(
      terseLog(
        readFileSync(join(__dirname, "sample-output.jsonstream"), "utf8")
      )
    ).to.deep.equal(
      JSON.parse(
        readFileSync(join(__dirname, "sample-output.terselog.json"), "utf8")
      )
    );
  });
});
