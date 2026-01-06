import { useState, useRef, useEffect } from 'react';
import { Search, Mic, X, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SmartSearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    recentSearches?: string[];
    suggestions?: string[];
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
    onSearch,
    placeholder = 'Search menu...',
    recentSearches = [],
    suggestions = [],
}) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice search not supported in this browser');
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            onSearch(transcript);
        };

        recognition.start();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
            inputRef.current?.blur();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        onSearch(suggestion);
        setIsFocused(false);
    };

    const filteredSuggestions = suggestions.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="relative">
            {/* Search Input */}
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                        placeholder={placeholder}
                        className="w-full pl-12 pr-24 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all"
                    />

                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {query && (
                            <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                type="button"
                                onClick={() => setQuery('')}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </motion.button>
                        )}

                        <button
                            type="button"
                            onClick={handleVoiceSearch}
                            className={`p-2 rounded-lg transition-all ${isListening
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'hover:bg-white/10 text-gray-400'
                                }`}
                        >
                            <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
                {isFocused && (query || recentSearches.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50"
                    >
                        {/* Autocomplete Suggestions */}
                        {query && filteredSuggestions.length > 0 && (
                            <div className="p-2">
                                <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                                    Suggestions
                                </div>
                                {filteredSuggestions.slice(0, 5).map((suggestion, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-3 py-3 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3"
                                    >
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <span className="text-white">{suggestion}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Recent Searches */}
                        {!query && recentSearches.length > 0 && (
                            <div className="p-2">
                                <div className="text-xs font-semibold text-gray-500 px-3 py-2">
                                    Recent Searches
                                </div>
                                {recentSearches.slice(0, 5).map((search, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSuggestionClick(search)}
                                        className="w-full text-left px-3 py-3 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3"
                                    >
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-300">{search}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
