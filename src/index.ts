#!/usr/bin/env node
/* eslint n/hashbang:"off" */
/* eslint-disable no-console, n/no-process-exit */
import split from "split2";
import { TerseAdvisoryLog } from "./terse-advisory-log.js";
import format from "./format.js";

const lAdvisoryLog: TerseAdvisoryLog = new TerseAdvisoryLog();

process.stdin
  .pipe(split(JSON.parse))
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
