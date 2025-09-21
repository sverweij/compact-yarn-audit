/* eslint-disable no-inline-comments */
/* eslint-disable security/detect-object-injection */
import { EOL } from "node:os";
import { styleText } from "node:util";
import type { ITerseEntry, SeverityType } from "./types.js";

function colorBySeverity(pSeverity: SeverityType, pString: string): string {
  const lSeverity2ColorFunction = new Map([
    ["critical", "red"],
    ["high", "magenta"],
    ["moderate", "yellow"],
    ["info", "blue"],
  ]);

  const lColor = lSeverity2ColorFunction.get(pSeverity) || "reset";

  // @ts-expect-error styleText is not properly typed yet; the 1st argument's type
  // is still private in the type declaration. Strings work fine, though
  return styleText(lColor, pString);
}

type IColumnWidthMap = Map<string, number>;

function getColumnWidth(
  pTerseEntries: ITerseEntry[],
  pColumnName: string,
): number {
  return pTerseEntries.reduce(
    // @ts-expect-error strings are perfectly valid as object keys for ITerseEntry
    (pAll, pEntry) => Math.max(pAll, pEntry[pColumnName].length),
    0,
  );
}
function getColumnWidths(
  pTerseEntries: ITerseEntry[],
  pWidthAvailable: number,
): IColumnWidthMap {
  const lColumns = ["severity", "title", "module_name", "via", "fixString"];
  const lReturnValue = new Map(
    lColumns.map((pColumn) => {
      return [pColumn, getColumnWidth(pTerseEntries, pColumn)];
    }),
  );
  const lAllColumnsLength = Array.from(lReturnValue.values()).reduce(
    (pAll, pLength) => {
      return pAll + pLength;
    },
    0,
  );
  const lMinimumTitleColumnWidth = 14;
  const lSpacesPerColumn = 2;
  const lAvailableForTitle = Math.min(
    lReturnValue.get("title")!,
    Math.max(
      lMinimumTitleColumnWidth,
      pWidthAvailable -
        (lAllColumnsLength - lReturnValue.get("title")!) - // all other columns
        lSpacesPerColumn * lColumns.length, // 2 spaces per column
    ),
  );
  lReturnValue.set("title", lAvailableForTitle);
  return lReturnValue;
}

function truncateTitle(pTitle: string, pWidth: number): string {
  let lReturnValue = pTitle.padEnd(pWidth).slice(0, pWidth);
  if (pTitle.length > pWidth) {
    lReturnValue = `${lReturnValue.slice(0, -1)}…`;
  }
  return lReturnValue;
}

export function terseAdvisoryLog2Table(
  pTerseEntries: ITerseEntry[],
  pColumnsAvailable: number = process.stdout.columns,
): string {
  const lColumnWidths = getColumnWidths(pTerseEntries, pColumnsAvailable);
  const lTitle = styleText(
    "bold",
    `${"severity".padEnd(lColumnWidths.get("severity")!)}  ` +
      `${"title".padEnd(lColumnWidths.get("title")!)}  ` +
      `${"module".padEnd(lColumnWidths.get("module_name")!)}  ` +
      `${"via".padEnd(lColumnWidths.get("via")!)}  ` +
      `"resolutions" string`,
  );

  const lCells = pTerseEntries
    .map((pEntry) => {
      return (
        `${colorBySeverity(
          pEntry.severity,
          `${pEntry.severity.padEnd(lColumnWidths.get("severity")!)}  `,
        )}` +
        `${truncateTitle(pEntry.title, lColumnWidths.get("title")!)}  ` +
        `${pEntry.module_name.padEnd(lColumnWidths.get("module_name")!)}  ` +
        `${pEntry.via.padEnd(lColumnWidths.get("via")!)}  ` +
        `${pEntry.fixString}`
      );
    })
    .join(EOL);

  return lTitle + EOL + lCells;
}
