interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

export function FilterBar({ search, onSearchChange, placeholder }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder ?? 'Search...'}
      />
    </div>
  );
}
