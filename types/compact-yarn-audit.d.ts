export type SeverityType = "critical" | "high" | "moderate" | "low" | "info";
export interface ITerseEntry {
  severity: SeverityType;
  title: string;
  fixable: boolean;
  fixString: string;
  module_name: string;
  via: string;
}
