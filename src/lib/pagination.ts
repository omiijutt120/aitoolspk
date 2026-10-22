export const PAGE_SIZE = 24;
export const pageCount = (items: number) =>
  Math.max(1, Math.ceil(items / PAGE_SIZE));
export const pagePath = (base: string, page: number) =>
  page === 1 ? base : `${base}page/${page}/`;
export function pageNumber(value?: string) {
  return value === undefined
    ? 1
    : /^[2-9]\d*$|^1\d+$/.test(value)
      ? Number(value)
      : NaN;
}
export const laterPages = (items: number) =>
  Array.from({ length: pageCount(items) - 1 }, (_, i) => String(i + 2));
