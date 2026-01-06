import { useState } from 'react';
import { useKeyboardShortcuts, defaultAdminShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useVoiceRecognition, useTextToSpeech } from '@/hooks/useVoiceRecognition';
import { SaveIndicator } from '@/components/SaveIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Keyboard } from 'lucide-react';

export default function FeatureTestPage() {
    const [testData, setTestData] = useState({ count: 0, text: '' });
    const [shortcuts, setShortcuts] = useState<string[]>([]);
    const [voiceLog, setVoiceLog] = useState<string[]>([]);

    // Test Auto-Save
    const { saveStatus, lastSaved, manualSave } = useAutoSave({
        data: testData,
        onSave: async (data) => {
            console.log('Auto-saving:', data);
            await new Promise(resolve => setTimeout(resolve, 500));
        },
        delay: 2000,
    });

    // Test Voice Recognition
    const { isListening, transcript, startListening, stopListening, isSupported: voiceSupported } = useVoiceRecognition();
    const { speak, isSpeaking } = useTextToSpeech();

    // Test Keyboard Shortcuts
    useKeyboardShortcuts({
        shortcuts: defaultAdminShortcuts({
            onSave: () => {
                setShortcuts(prev => [...prev, 'Ctrl+S pressed - Manual Save']);
                manualSave();
            },
            onUndo: () => {
                setShortcuts(prev => [...prev, 'Ctrl+Z pressed - Undo']);
                setTestData(prev => ({ ...prev, count: Math.max(0, prev.count - 1) }));
            },
            onRedo: () => {
                setShortcuts(prev => [...prev, 'Ctrl+Shift+Z pressed - Redo']);
                setTestData(prev => ({ ...prev, count: prev.count + 1 }));
            },
            onNew: () => {
                setShortcuts(prev => [...prev, 'Ctrl+N pressed - New Item']);
                setTestData({ count: 0, text: '' });
            },
            onSearch: () => {
                setShortcuts(prev => [...prev, 'Ctrl+K pressed - Search']);
            },
        }),
        enabled: true,
    });

    // Handle voice transcript
    useState(() => {
        if (transcript) {
            setVoiceLog(prev => [...prev, `Heard: "${transcript}"`]);
            if (transcript.toLowerCase().includes('hello')) {
                speak('Hello! Voice recognition is working!');
            }
        }
    });

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Feature Test Page</h1>
                    <p className="text-gray-400">Testing mobile-first admin features</p>
                </div>

                {/* Auto-Save Test */}
                <Card className="bg-black/40 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                            <span>Test 2: Auto-Save System</span>
                            <SaveIndicator
                                status={saveStatus}
                                lastSaved={lastSaved}
                                error={null}
                                onRetry={manualSave}
                            />
                        </CardTitle>
                        <CardDescription>
                            Make changes and watch the auto-save indicator (2s delay)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Button
                                onClick={() => setTestData(prev => ({ ...prev, count: prev.count + 1 }))}
                                className="bg-cyan-600 hover:bg-cyan-700"
                            >
                                Increment Count ({testData.count})
                            </Button>
                            <Button
                                onClick={manualSave}
                                variant="outline"
                            >
                                Manual Save
                            </Button>
                        </div>
                        <input
                            type="text"
                            value={testData.text}
                            onChange={(e) => setTestData(prev => ({ ...prev, text: e.target.value }))}
                            placeholder="Type something to trigger auto-save..."
                            className="w-full px-4 py-2 bg-black/60 border border-white/20 rounded text-white"
                        />
                    </CardContent>
                </Card>

                {/* Keyboard Shortcuts Test */}
                <Card className="bg-black/40 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Keyboard className="w-5 h-5" />
                            Test 3: Keyboard Shortcuts
                        </CardTitle>
                        <CardDescription>
                            Try: Ctrl+S (Save), Ctrl+Z (Undo), Ctrl+Shift+Z (Redo), Ctrl+N (New), Ctrl+K (Search)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-48 overflow-y-auto bg-black/60 p-4 rounded">
                            {shortcuts.length === 0 ? (
                                <p className="text-gray-500 italic">Press keyboard shortcuts to test...</p>
                            ) : (
                                shortcuts.map((log, i) => (
                                    <div key={i} className="text-sm text-cyan-400 font-mono">
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Voice Recognition Test */}
                <Card className="bg-black/40 border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            {isListening ? <Mic className="w-5 h-5 text-red-500 animate-pulse" /> : <MicOff className="w-5 h-5" />}
                            Test 4: Voice Recognition
                        </CardTitle>
                        <CardDescription>
                            {voiceSupported
                                ? 'Click to start voice recognition. Try saying "hello"'
                                : 'Voice recognition not supported in this browser'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Button
                                onClick={isListening ? stopListening : startListening}
                                disabled={!voiceSupported}
                                className={isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                            >
                                {isListening ? 'Stop Listening' : 'Start Listening'}
                            </Button>
                            <Button
                                onClick={() => speak('Testing text to speech')}
                                disabled={isSpeaking}
                                variant="outline"
                            >
                                Test Text-to-Speech
                            </Button>
                        </div>

                        {transcript && (
                            <div className="p-4 bg-cyan-900/20 border border-cyan-500/30 rounded">
                                <p className="text-sm text-gray-400">Current transcript:</p>
                                <p className="text-white font-semibold">{transcript}</p>
                            </div>
                        )}

                        <div className="space-y-2 max-h-48 overflow-y-auto bg-black/60 p-4 rounded">
                            {voiceLog.length === 0 ? (
                                <p className="text-gray-500 italic">Voice logs will appear here...</p>
                            ) : (
                                voiceLog.map((log, i) => (
                                    <div key={i} className="text-sm text-purple-400 font-mono">
                                        {log}
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Test Summary */}
                <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-white">Test Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-white">Auto-Save: {saveStatus}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                            <span className="text-white">Keyboard Shortcuts: {shortcuts.length} triggered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${voiceSupported ? 'bg-purple-500' : 'bg-gray-500'}`}></div>
                            <span className="text-white">Voice Recognition: {voiceSupported ? 'Supported' : 'Not Supported'}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
