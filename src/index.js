#!/usr/bin/env node
import ndjson from "ndjson";
import { TerseAdvisoryLog } from "./terse-advisory-log.js";
import { TerseAdvisoryLog2Table } from "./terse-advisory-to-table.js";

const lAdvisaryLog = new TerseAdvisoryLog();

process.stdin
  .pipe(ndjson.parse())
  .on("data", (pLogEntry) => {
    lAdvisaryLog.add(pLogEntry);
  })
  .on("error", (pError) => {
    console.error(pError);
    process.exitCode = 1;
    process.exit();
  })
  .on("end", () => {
    console.log(TerseAdvisoryLog2Table(lAdvisaryLog.get()));
  });
