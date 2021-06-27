#!/usr/bin/env node
import ndjson from "ndjson";
import { sortLog, extractUsefulAttributes } from "./log-to-terse-object.js";
import { terseLog2Table } from "./terse-object-to-table.js";

let lLog = [];

process.stdin
  .pipe(ndjson.parse())
  .on("data", (pLogEntry) => {
    if (pLogEntry.type === "auditAdvisory") {
      lLog.push(extractUsefulAttributes(pLogEntry));
    }
  })
  .on("error", (pError) => {
    console.error(pError);
    process.exitCode = 1;
    process.exit();
  })
  .on("end", () => {
    console.log(terseLog2Table(sortLog(lLog)));
  });
