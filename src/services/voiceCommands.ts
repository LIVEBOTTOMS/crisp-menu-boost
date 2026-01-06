import { useNavigate } from 'react-router-dom';
import { MenuItem } from '@/data/menuData';

interface VoiceCommand {
    pattern: RegExp;
    action: (matches: RegExpMatchArray) => void | Promise<void>;
    description: string;
    requiresConfirmation?: boolean;
}

export class VoiceCommandService {
    private commands: VoiceCommand[] = [];
    private navigate: ReturnType<typeof useNavigate>;
    private onCommand?: (command: string, result: string) => void;

    constructor(navigate: ReturnType<typeof useNavigate>, onCommand?: (command: string, result: string) => void) {
        this.navigate = navigate;
        this.onCommand = onCommand;
        this.registerDefaultCommands();
    }

    private registerDefaultCommands() {
        // Navigation commands
        this.register({
            pattern: /go to (dashboard|menu|settings|pricing)/i,
            action: (matches) => {
                const destination = matches[1].toLowerCase();
                const routes: Record<string, string> = {
                    dashboard: '/admin',
                    menu: '/menus',
                    settings: '/admin/settings',
                    pricing: '/pricing'
                };
                this.navigate(routes[destination]);
                this.onCommand?.(`Navigate to ${destination}`, `Navigating to ${destination}`);
            },
            description: 'Navigate to different pages'
        });

        this.register({
            pattern: /open (menu editor|edit mode)/i,
            action: () => {
                this.navigate('/admin/edit');
                this.onCommand?.('Open editor', 'Opening menu editor');
            },
            description: 'Open menu editor'
        });

        // Item management commands
        this.register({
            pattern: /add (?:new )?(?:a )?(\w+)(?: item)?/i,
            action: (matches) => {
                const itemType = matches[1];
                this.onCommand?.(`Add ${itemType}`, `Opening dialog to add ${itemType} item`);
                // Trigger add item dialog
                window.dispatchEvent(new CustomEvent('voice-add-item', { detail: { itemType } }));
            },
            description: 'Add new menu item'
        });

        this.register({
            pattern: /delete (.+)/i,
            action: (matches) => {
                const itemName = matches[1];
                this.onCommand?.(`Delete ${itemName}`, `Preparing to delete ${itemName}`);
                window.dispatchEvent(new CustomEvent('voice-delete-item', { detail: { itemName } }));
            },
            description: 'Delete menu item',
            requiresConfirmation: true
        });

        this.register({
            pattern: /(?:change|update|set) (?:the )?price of (.+) to (?:rupees? )?(\d+)/i,
            action: (matches) => {
                const itemName = matches[1];
                const price = matches[2];
                this.onCommand?.(`Update price`, `Setting ${itemName} price to ₹${price}`);
                window.dispatchEvent(new CustomEvent('voice-update-price', {
                    detail: { itemName, price: parseInt(price) }
                }));
            },
            description: 'Update item price'
        });

        // Bulk operations
        this.register({
            pattern: /increase (?:all )?prices by (\d+) percent/i,
            action: (matches) => {
                const percent = matches[1];
                this.onCommand?.(`Bulk price increase`, `Increasing all prices by ${percent}%`);
                window.dispatchEvent(new CustomEvent('voice-bulk-price', {
                    detail: { percent: parseInt(percent), operation: 'increase' }
                }));
            },
            description: 'Bulk price increase',
            requiresConfirmation: true
        });

        this.register({
            pattern: /decrease (?:all )?prices by (\d+) percent/i,
            action: (matches) => {
                const percent = matches[1];
                this.onCommand?.(`Bulk price decrease`, `Decreasing all prices by ${percent}%`);
                window.dispatchEvent(new CustomEvent('voice-bulk-price', {
                    detail: { percent: -parseInt(percent), operation: 'decrease' }
                }));
            },
            description: 'Bulk price decrease',
            requiresConfirmation: true
        });

        // Quick actions
        this.register({
            pattern: /save (?:changes|menu)/i,
            action: () => {
                this.onCommand?.('Save', 'Saving changes');
                window.dispatchEvent(new CustomEvent('voice-save'));
            },
            description: 'Save changes'
        });

        this.register({
            pattern: /undo(?: last change)?/i,
            action: () => {
                this.onCommand?.('Undo', 'Undoing last change');
                window.dispatchEvent(new CustomEvent('voice-undo'));
            },
            description: 'Undo last change'
        });

        this.register({
            pattern: /download (?:menu )?(?:pdf|menu)/i,
            action: () => {
                this.onCommand?.('Download PDF', 'Preparing PDF download');
                window.dispatchEvent(new CustomEvent('voice-download-pdf'));
            },
            description: 'Download menu PDF'
        });

        this.register({
            pattern: /refresh|reload/i,
            action: () => {
                this.onCommand?.('Refresh', 'Refreshing menu data');
                window.location.reload();
            },
            description: 'Refresh page'
        });
    }

    register(command: VoiceCommand) {
        this.commands.push(command);
    }

    async process(transcript: string): Promise<{ success: boolean; message: string; requiresConfirmation?: boolean }> {
        const normalizedTranscript = transcript.trim().toLowerCase();

        for (const command of this.commands) {
            const matches = normalizedTranscript.match(command.pattern);
            if (matches) {
                if (command.requiresConfirmation) {
                    return {
                        success: true,
                        message: `This action requires confirmation. Say "confirm" to proceed.`,
                        requiresConfirmation: true
                    };
                }

                try {
                    await command.action(matches);
                    return { success: true, message: 'Command executed successfully' };
                } catch (error) {
                    return { success: false, message: `Error executing command: ${error}` };
                }
            }
        }

        return { success: false, message: 'Command not recognized. Try "help" for available commands.' };
    }

    getAvailableCommands(): string[] {
        return this.commands.map(cmd => cmd.description);
    }
}

// Fuzzy matching for item names
export const fuzzyMatch = (search: string, target: string, threshold = 0.6): boolean => {
    const searchLower = search.toLowerCase();
    const targetLower = target.toLowerCase();

    // Exact match
    if (targetLower.includes(searchLower)) return true;

    // Calculate Levenshtein distance
    const distance = levenshteinDistance(searchLower, targetLower);
    const maxLength = Math.max(searchLower.length, targetLower.length);
    const similarity = 1 - distance / maxLength;

    return similarity >= threshold;
};

const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[str2.length][str1.length];
};
