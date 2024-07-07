#!/usr/bin/env node
import split from "split2";
import { TerseAdvisoryLog } from "./terse-advisory-log.js";
import format from "./format.js";
const lAdvisoryLog = new TerseAdvisoryLog();
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
