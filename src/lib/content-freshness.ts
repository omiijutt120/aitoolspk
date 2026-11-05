import { execFileSync } from 'node:child_process';

/**
 * A sitemap `lastmod` is only useful to crawlers while it matches the file that
 * actually renders the route. Hard-coded dates silently rot, so every static
 * route instead reports the newest commit that touched its source files.
 *
 * The release pipeline checks out full history (fetch-depth: 0). When history
 * is unavailable — source archives, shallow clones — the fallback keeps the
 * sitemap valid rather than dropping `lastmod` entirely.
 */
const FALLBACK = '2026-11-06';

let cache: Map<string, string> | null = null;

function lastCommitDates(): Map<string, string> {
  if (cache) return cache;
  const dates = new Map<string, string>();
  try {
    const log = execFileSync(
      'git',
      ['log', '--pretty=format:__commit__%cI', '--name-only', '--', '.'],
      {
        cwd: process.cwd(),
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'ignore'],
      }
    );
    let current = '';
    for (const raw of log.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('__commit__')) {
        current = line.slice('__commit__'.length).slice(0, 10);
      } else if (current && !dates.has(line)) {
        // `git log` walks newest first, so the first hit is the latest edit.
        dates.set(line, current);
      }
    }
  } catch {
    // No repository available: `modified` falls back to a fixed date.
  }
  cache = dates;
  return dates;
}

/** Newest commit date across the given repository-relative source paths. */
export function modified(...paths: string[]): string {
  const dates = lastCommitDates();
  let newest = '';
  for (const path of paths) {
    const date = dates.get(path.replaceAll('\\', '/'));
    if (date && date > newest) newest = date;
  }
  return newest || FALLBACK;
}

/** Newest of a set of ISO dates, ignoring empty values. */
export function latest(
  ...values: (string | undefined | null)[]
): string {
  const present = values.filter((value): value is string => Boolean(value));
  return present.sort().at(-1) || FALLBACK;
}
