import { useState, useEffect } from 'react';

const STORAGE_KEY = 'totenbilder_grid_size';
const DEFAULT_SIZE = 0;

export function useGridSize() {
    const [gridSize, setGridSize] = useState<number>(DEFAULT_SIZE);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const savedSize = localStorage.getItem(STORAGE_KEY);
            console.log('useGridSize: Loaded from storage:', savedSize);
            if (savedSize !== null) {
                const parsed = parseInt(savedSize, 10);
                if (!isNaN(parsed)) {
                    setGridSize(parsed);
                }
            }
        } catch (e) {
            console.warn('Failed to load grid size from local storage', e);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    const handleGridSizeChange = (size: number) => {
        setGridSize(size);
        try {
            localStorage.setItem(STORAGE_KEY, size.toString());
        } catch (e) {
            console.warn('Failed to save grid size to local storage', e);
        }
    };

    return {
        gridSize,
        setGridSize: handleGridSizeChange,
        isLoaded
    };
}
