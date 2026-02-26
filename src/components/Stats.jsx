import React from 'react';
import { formatFileSize } from '../utils/fileHelpers';

/**
 * Stats Component - Displays session statistics
 */
export default function Stats({
    totalFiles,
    currentIndex,
    deletedCount,
    keptCount,
    storageToSave
}) {
    const progress = totalFiles > 0 ? ((currentIndex / totalFiles) * 100).toFixed(0) : 0;

    return (
        <div className="fixed top-6 left-6 right-6 z-10 flex justify-between items-start gap-4">
            {/* Left side - Progress */}
            <div className="bg-sand border-2 border-ink shadow-hard-md p-4 font-mono">
                <div className="text-xs opacity-60 mb-1">PROGRESS</div>
                <div className="text-2xl font-bold">
                    {currentIndex} / {totalFiles}
                </div>
                <div className="mt-2 h-2 bg-ink-10 border border-ink">
                    <div
                        className="h-full bg-ink transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Right side - Stats */}
            <div className="bg-sand border-2 border-ink shadow-hard-md p-4 font-mono">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs opacity-60 mb-1">DELETED</div>
                        <div className="text-2xl font-bold text-red-600">{deletedCount}</div>
                    </div>
                    <div>
                        <div className="text-xs opacity-60 mb-1">KEPT</div>
                        <div className="text-2xl font-bold text-green-600">{keptCount}</div>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-t border-ink">
                    <div className="text-xs opacity-60 mb-1">STORAGE TO SAVE</div>
                    <div className="text-xl font-bold">{formatFileSize(storageToSave)}</div>
                </div>
            </div>
        </div>
    );
}
