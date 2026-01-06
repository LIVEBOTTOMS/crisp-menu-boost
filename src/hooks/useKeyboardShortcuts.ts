import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    action: () => void;
    description: string;
    preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
    shortcuts: KeyboardShortcut[];
    enabled?: boolean;
}

export const useKeyboardShortcuts = ({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) => {
    const shortcutsRef = useRef(shortcuts);

    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Don't trigger shortcuts when typing in inputs
        const target = event.target as HTMLElement;
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            // Allow Ctrl+S even in inputs
            if (!(event.ctrlKey && event.key.toLowerCase() === 's')) {
                return;
            }
        }

        for (const shortcut of shortcutsRef.current) {
            const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
            const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
            const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;
            const altMatches = shortcut.alt ? event.altKey : !event.altKey;

            if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
                if (shortcut.preventDefault !== false) {
                    event.preventDefault();
                }
                shortcut.action();
                break;
            }
        }
    }, [enabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
};

// Predefined shortcut configurations
export const defaultAdminShortcuts = (handlers: {
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    onNew?: () => void;
    onDuplicate?: () => void;
    onDelete?: () => void;
    onSelectAll?: () => void;
    onDeselectAll?: () => void;
    onBulkEdit?: () => void;
    onSearch?: () => void;
    onEscape?: () => void;
}): KeyboardShortcut[] => [
        // Global actions
        {
            key: 's',
            ctrl: true,
            action: handlers.onSave || (() => { }),
            description: 'Save changes',
        },
        {
            key: 'z',
            ctrl: true,
            action: handlers.onUndo || (() => { }),
            description: 'Undo',
        },
        {
            key: 'z',
            ctrl: true,
            shift: true,
            action: handlers.onRedo || (() => { }),
            description: 'Redo',
        },
        {
            key: 'k',
            ctrl: true,
            action: handlers.onSearch || (() => { }),
            description: 'Open search',
        },
        {
            key: 'Escape',
            action: handlers.onEscape || (() => { }),
            description: 'Close dialog/Cancel',
            preventDefault: false,
        },

        // Item management
        {
            key: 'n',
            ctrl: true,
            action: handlers.onNew || (() => { }),
            description: 'Create new item',
        },
        {
            key: 'd',
            ctrl: true,
            action: handlers.onDuplicate || (() => { }),
            description: 'Duplicate selected',
        },
        {
            key: 'Delete',
            action: handlers.onDelete || (() => { }),
            description: 'Delete selected',
        },

        // Selection
        {
            key: 'a',
            ctrl: true,
            action: handlers.onSelectAll || (() => { }),
            description: 'Select all',
        },
        {
            key: 'a',
            ctrl: true,
            shift: true,
            action: handlers.onDeselectAll || (() => { }),
            description: 'Deselect all',
        },
        {
            key: 'b',
            ctrl: true,
            action: handlers.onBulkEdit || (() => { }),
            description: 'Bulk edit selected',
        },
    ];

// Hook for showing keyboard shortcut hints
export const useShortcutHints = (shortcuts: KeyboardShortcut[]) => {
    const formatShortcut = (shortcut: KeyboardShortcut): string => {
        const parts: string[] = [];
        if (shortcut.ctrl) parts.push('Ctrl');
        if (shortcut.shift) parts.push('Shift');
        if (shortcut.alt) parts.push('Alt');
        if (shortcut.meta) parts.push('Cmd');
        parts.push(shortcut.key.toUpperCase());
        return parts.join(' + ');
    };

    return shortcuts.map(shortcut => ({
        keys: formatShortcut(shortcut),
        description: shortcut.description,
    }));
};
