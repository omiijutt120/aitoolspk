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
let firstCache: Map<string, string> | null = null;

/** Every commit date per repository-relative path; `git log` walks newest first. */
function commitDates(): Map<string, string[]> {
  const dates = new Map<string, string[]>();
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
      } else if (current) {
        const seen = dates.get(line);
        // The log is newest-first, so the first entry is the latest edit.
        if (seen) seen.push(current);
        else dates.set(line, [current]);
      }
    }
  } catch {
    // No repository available; callers fall back to fixed dates.
  }
  return dates;
}

function lastCommitDates(): Map<string, string> {
  if (cache) return cache;
  const dates = new Map<string, string>();
  for (const [file, commits] of commitDates()) {
    let newest = '';
    for (const commit of commits) if (commit > newest) newest = commit;
    dates.set(file, newest);
  }
  cache = dates;
  return dates;
}

function firstCommitDates(): Map<string, string> {
  if (firstCache) return firstCache;
  const dates = new Map<string, string>();
  for (const [file, commits] of commitDates()) dates.set(file, commits.at(-1)!);
  firstCache = dates;
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

/**
 * Oldest commit date across the given paths — the closest thing this repo has
 * to a publication date. Used only where a type requires `datePublished` and no
 * date was ever recorded by hand, so it is derived rather than invented.
 */
export function published(...paths: string[]): string {
  const dates = firstCommitDates();
  let oldest = '';
  for (const path of paths) {
    const date = dates.get(path.replaceAll('\\', '/'));
    if (date && (!oldest || date < oldest)) oldest = date;
  }
  return oldest || FALLBACK;
}

/** Newest of a set of ISO dates, ignoring empty values. */
export function latest(...values: (string | undefined | null)[]): string {
  const present = values.filter((value): value is string => Boolean(value));
  return present.sort().at(-1) || FALLBACK;
}
