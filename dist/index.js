#!/usr/bin/env node
import ndjson from "ndjson";
import { TerseAdvisoryLog } from "./terse-advisory-log.js";
import format from "./format.js";
const lAdvisoryLog = new TerseAdvisoryLog();
process.stdin
    .pipe(ndjson.parse())
    .on("data", (pLogEntry) => {
    lAdvisoryLog.add(pLogEntry);
})
    .on("error", (pError) => {
    console.error(pError);
    process.exitCode = 1;
    process.exit();
})
    .on("end", () => {
    console.log(format(lAdvisoryLog.get()));
});
