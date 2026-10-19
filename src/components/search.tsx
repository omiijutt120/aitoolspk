import { Search, ArrowRight } from 'lucide-react';
export function SearchForm({ compact = false }: { compact?: boolean }) {
  return (
    <form
      action="/tools/"
      role="search"
      className={`search-form ${compact ? 'compact' : ''}`}
    >
      <Search size={20} aria-hidden="true" />
      <label
        htmlFor={compact ? 'header-search' : 'hero-search'}
        className="sr-only"
      >
        Search tools, brands or tasks
      </label>
      <input
        id={compact ? 'header-search' : 'hero-search'}
        name="q"
        placeholder="Search tools, brands or tasks…"
        autoComplete="off"
      />
      <button aria-label="Search tools" type="submit">
        <ArrowRight size={20} />
      </button>
    </form>
  );
}
