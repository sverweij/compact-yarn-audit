#!/usr/bin/env node
import getStream from "get-stream";
import { terseLog } from "./log-to-terse-object.js";
import { terseLog2Table } from "./terse-object-to-table.js";

getStream(process.stdin)
  .then((pLog) => {
    const lTerseLog = terseLog(pLog);
    console.log(terseLog2Table(lTerseLog));
  })
  .catch((pError) => {
    console.error(pError);
  });
