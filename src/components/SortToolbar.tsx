'use client';

type SortField = 'name' | 'deathDate' | 'birthYear' | '';
type SortOrder = 'asc' | 'desc';

interface SortToolbarProps {
    currentSort: SortField;
    currentOrder: SortOrder;
    onSortChange: (sort: SortField, order: SortOrder) => void;
}

export default function SortToolbar({ currentSort, currentOrder, onSortChange }: SortToolbarProps) {
    return (
        <div className="flex flex-wrap items-center gap-4 bg-white p-3 rounded-lg border border-[var(--c-border)] shadow-sm mb-6 text-sm">
            <span className="font-bold text-[var(--c-text-secondary)] uppercase text-xs tracking-wider">Sortieren nach:</span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onSortChange('name', currentSort === 'name' && currentOrder === 'asc' ? 'desc' : 'asc')}
                    className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${currentSort === 'name'
                            ? 'bg-[var(--c-bg-accent)] text-[var(--c-accent)] font-medium'
                            : 'hover:bg-[var(--c-bg-main)] text-[var(--c-text-primary)]'
                        }`}
                >
                    Nachname
                    {currentSort === 'name' && (
                        <span>{currentOrder === 'asc' ? '↓' : '↑'}</span>
                    )}
                </button>

                <button
                    onClick={() => onSortChange('deathDate', currentSort === 'deathDate' && currentOrder === 'asc' ? 'desc' : 'asc')}
                    className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${currentSort === 'deathDate'
                            ? 'bg-[var(--c-bg-accent)] text-[var(--c-accent)] font-medium'
                            : 'hover:bg-[var(--c-bg-main)] text-[var(--c-text-primary)]'
                        }`}
                >
                    Sterbetag
                    {currentSort === 'deathDate' && (
                        <span>{currentOrder === 'asc' ? '↓' : '↑'}</span>
                    )}
                </button>

                <button
                    onClick={() => onSortChange('birthYear', currentSort === 'birthYear' && currentOrder === 'asc' ? 'desc' : 'asc')}
                    className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1 ${currentSort === 'birthYear'
                            ? 'bg-[var(--c-bg-accent)] text-[var(--c-accent)] font-medium'
                            : 'hover:bg-[var(--c-bg-main)] text-[var(--c-text-primary)]'
                        }`}
                >
                    Geburtsjahr
                    {currentSort === 'birthYear' && (
                        <span>{currentOrder === 'asc' ? '↓' : '↑'}</span>
                    )}
                </button>
            </div>
        </div>
    );
}
