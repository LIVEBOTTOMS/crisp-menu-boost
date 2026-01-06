import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoSaveOptions<T> {
    data: T;
    onSave: (data: T) => Promise<void>;
    delay?: number;
    enabled?: boolean;
}

export type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error';

interface UseAutoSaveReturn {
    saveStatus: SaveStatus;
    lastSaved: Date | null;
    error: Error | null;
    manualSave: () => Promise<void>;
}

export const useAutoSave = <T>({
    data,
    onSave,
    delay = 2000,
    enabled = true,
}: UseAutoSaveOptions<T>): UseAutoSaveReturn => {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dataRef = useRef<T>(data);
    const isSavingRef = useRef(false);

    // Update data ref when data changes
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    const performSave = useCallback(async () => {
        if (isSavingRef.current) return;

        isSavingRef.current = true;
        setSaveStatus('saving');
        setError(null);

        try {
            await onSave(dataRef.current);
            setSaveStatus('saved');
            setLastSaved(new Date());
            setError(null);
        } catch (err) {
            setSaveStatus('error');
            setError(err as Error);
            console.error('Auto-save error:', err);
        } finally {
            isSavingRef.current = false;
        }
    }, [onSave]);

    const manualSave = useCallback(async () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        await performSave();
    }, [performSave]);

    useEffect(() => {
        if (!enabled) return;

        // Mark as unsaved when data changes
        if (saveStatus !== 'saving') {
            setSaveStatus('unsaved');
        }

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for auto-save
        timeoutRef.current = setTimeout(() => {
            performSave();
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [data, delay, enabled, performSave, saveStatus]);

    return {
        saveStatus,
        lastSaved,
        error,
        manualSave,
    };
};

// Hook for tracking changes and providing undo/redo
interface UseUndoRedoOptions<T> {
    initialState: T;
    maxHistory?: number;
}

interface UseUndoRedoReturn<T> {
    state: T;
    setState: (newState: T | ((prev: T) => T)) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    clearHistory: () => void;
}

export const useUndoRedo = <T>({
    initialState,
    maxHistory = 50,
}: UseUndoRedoOptions<T>): UseUndoRedoReturn<T> => {
    const [history, setHistory] = useState<T[]>([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const state = history[currentIndex];

    const setState = useCallback((newState: T | ((prev: T) => T)) => {
        setHistory(prev => {
            const resolvedState = typeof newState === 'function'
                ? (newState as (prev: T) => T)(prev[currentIndex])
                : newState;

            // Remove any future states (redo history)
            const newHistory = prev.slice(0, currentIndex + 1);

            // Add new state
            newHistory.push(resolvedState);

            // Limit history size
            if (newHistory.length > maxHistory) {
                newHistory.shift();
                setCurrentIndex(prev => prev); // Keep index the same since we removed from start
            } else {
                setCurrentIndex(newHistory.length - 1);
            }

            return newHistory;
        });
    }, [currentIndex, maxHistory]);

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, history.length]);

    const clearHistory = useCallback(() => {
        setHistory([state]);
        setCurrentIndex(0);
    }, [state]);

    return {
        state,
        setState,
        undo,
        redo,
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        clearHistory,
    };
};
