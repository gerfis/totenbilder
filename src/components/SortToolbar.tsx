'use client';

type SortField = 'name' | 'deathDate' | 'birthYear' | '';
type SortOrder = 'asc' | 'desc';

interface SortToolbarProps {
    currentSort: SortField;
    currentOrder: SortOrder;
    onSortChange: (sort: SortField, order: SortOrder) => void;
    gridSize?: number;
    onGridSizeChange?: (size: number) => void;
}

export default function SortToolbar({ currentSort, currentOrder, onSortChange, gridSize = 0, onGridSizeChange }: SortToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 rounded-lg border border-[var(--c-border)] shadow-sm mb-6 text-sm">
            <div className="flex flex-wrap items-center gap-4">
                <span className="font-bold text-[var(--c-text-secondary)] uppercase text-xs tracking-wider">Sortieren:</span>

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

            {onGridSizeChange && (
                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-[var(--c-border)] pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0 w-full sm:w-auto">
                    <span className="font-bold text-[var(--c-text-secondary)] uppercase text-xs tracking-wider hidden sm:inline">Größe:</span>
                    <div className="flex items-center gap-1 bg-[var(--c-bg-main)] p-1 rounded-lg">
                        <button
                            onClick={() => onGridSizeChange(Math.max(gridSize - 1, -2))}
                            disabled={gridSize <= -2}
                            title="Kleiner (mehr Spalten)"
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-[var(--c-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                        </button>
                        <div className="w-px h-4 bg-[var(--c-border)] mx-1"></div>
                        <button
                            onClick={() => onGridSizeChange(Math.min(gridSize + 1, 2))}
                            disabled={gridSize >= 2}
                            title="Größer (weniger Spalten)"
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-[var(--c-text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
