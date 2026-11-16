/**
 * Small CSV helpers shared by the reporting scripts.
 *
 * The seller quote round-trip is edited in Excel and Numbers, so the reader
 * has to survive a BOM, CRLF line endings, quoted commas and the occasional
 * trailing blank line. The writer quotes only when it must, so the file stays
 * readable when opened in a plain text editor.
 */

const needsQuotes = (value) => /[",\r\n]/.test(value);

export function escapeCsv(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return needsQuotes(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * @param {Array<Record<string, unknown>>} rows
 * @param {Array<string | { key: string, header: string }>} columns
 */
export function toCsv(rows, columns) {
  const fields = columns.map((column) =>
    typeof column === 'string' ? { key: column, header: column } : column
  );
  const header = fields.map((field) => escapeCsv(field.header)).join(',');
  const body = rows.map((row) =>
    fields.map((field) => escapeCsv(row[field.key])).join(',')
  );
  return [header, ...body].join('\r\n') + '\r\n';
}

/**
 * Parses CSV text into objects keyed by the header row. Empty lines are
 * ignored; a missing trailing newline is fine. Duplicate headers are rejected
 * because a duplicated column silently overwrites a sibling.
 */
export function parseCsv(text) {
  const input = text.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let line = 1;
  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else {
        if (c === '\n') line += 1;
        field += c;
      }
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && input[i + 1] === '\n') i += 1;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push({ line, cells: row });
      row = [];
      field = '';
      line += 1;
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value.trim())) rows.push({ line, cells: row });
  }
  if (!rows.length) return [];
  const headers = rows[0].cells.map((value) => value.trim());
  const seen = new Set();
  for (const header of headers) {
    if (!header) throw new Error(`CSV header has an empty column name`);
    if (seen.has(header)) throw new Error(`CSV header repeats "${header}"`);
    seen.add(header);
  }
  return rows.slice(1).map(({ line: rowLine, cells }) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? '').trim();
    });
    Object.defineProperty(record, '__line', {
      value: rowLine,
      enumerable: false,
    });
    return record;
  });
}
