/**
 * Argument parsing for the operational scripts. Deliberately tiny: these
 * commands are run by the owner, so `--flag`, `--key value` and `--key=value`
 * are the whole surface, and an unknown flag is a mistake worth failing on.
 */

export function parseArgs(argv = process.argv.slice(2), { known = [] } = {}) {
  const flags = new Set();
  const values = new Map();
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') {
      positional.push(...argv.slice(i + 1));
      break;
    }
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const body = arg.slice(2);
    const equals = body.indexOf('=');
    const name = equals === -1 ? body : body.slice(0, equals);
    if (known.length && !known.includes(name))
      throw new Error(`Unknown flag --${name}`);
    if (equals !== -1) {
      values.set(name, body.slice(equals + 1));
      continue;
    }
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      values.set(name, next);
      i += 1;
    } else {
      flags.add(name);
    }
  }
  return {
    flags,
    values,
    positional,
    has: (name) => flags.has(name),
    get: (name, fallback) => (values.has(name) ? values.get(name) : fallback),
    number(name, fallback) {
      if (!values.has(name)) return fallback;
      const parsed = Number(values.get(name));
      if (!Number.isFinite(parsed))
        throw new Error(`--${name} must be a number`);
      return parsed;
    },
  };
}
