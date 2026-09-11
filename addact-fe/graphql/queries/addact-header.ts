export * from "./getHeader";
export { getHeaderData as getAddactHeaderData } from "./getHeader";
export default function defaultExport(region?: string) {
  return import("./getHeader").then(m => m.getHeaderData(region));
}
