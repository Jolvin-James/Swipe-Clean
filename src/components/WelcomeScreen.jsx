import React from 'react';
import Button from './Button';

/**
 * Welcome Screen Component
 */
export default function WelcomeScreen({ onSelectFolder }) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            <div className="max-w-3xl w-full">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="font-display text-8xl font-extrabold tracking-tight mb-6 uppercase">
                        SwipeClean
                    </h1>
                    <p className="font-mono text-xl mb-4">
                        Gamified Digital File Management
                    </p>
                    <p className="font-mono text-sm opacity-60 max-w-xl mx-auto">
                        Turn the tedious chore of cleaning your Downloads folder into a fun,
                        dopamine-driven game. Swipe left to delete, swipe right to keep.
                    </p>
                </div>

                {/* Privacy Banner */}
                <div className="bg-sand border-2 border-ink shadow-hard-lg p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl text-ink">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-mono font-bold text-lg mb-2">100% PRIVATE & LOCAL</h3>
                            <p className="font-mono text-sm opacity-80">
                                All file processing happens in your browser. No uploads. No cloud.
                                No tracking. Your files never leave your computer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mb-12">
                    <Button onClick={onSelectFolder} variant="secondary" className="text-xl px-12 py-6">
                        Select Folder to Clean
                    </Button>
                    <p className="font-mono text-xs mt-4 opacity-60">
                        Works with Chrome, Edge, and Opera browsers
                    </p>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="bg-sand border-2 border-ink shadow-hard-md p-6">
                    <h3 className="font-mono font-bold text-sm mb-4 uppercase">Keyboard Shortcuts</h3>
                    <div className="grid grid-cols-2 gap-4 font-mono text-sm">
                        <div className="flex items-center gap-3">
                            <kbd className="px-3 py-1 bg-ink text-sand border-2 border-ink">←</kbd>
                            <span>Delete File</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <kbd className="px-3 py-1 bg-ink text-sand border-2 border-ink">→</kbd>
                            <span>Keep File</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <kbd className="px-3 py-1 bg-ink text-sand border-2 border-ink">Ctrl+Z</kbd>
                            <span>Undo</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <kbd className="px-3 py-1 bg-ink text-sand border-2 border-ink">Space</kbd>
                            <span>Expand Preview</span>
                        </div>
                    </div>
                </div>

                {/* Browser Support Notice */}
                <div className="mt-8 p-4 bg-ink-10 border border-ink text-center">
                    <div className="flex items-center justify-center gap-2 font-mono text-xs">
                        <svg className="w-4 h-4 text-ink flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>
                            This app requires the File System Access API.
                            Please use a Chromium-based browser (Chrome, Edge, Opera).
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
