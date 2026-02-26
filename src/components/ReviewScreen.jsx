import React from 'react';
import Button from './Button';
import { formatFileSize } from '../utils/fileHelpers';

/**
 * Review Screen - Shows files marked for deletion before final execution
 */
export default function ReviewScreen({
    filesToDelete,
    filesToKeep,
    onConfirm,
    onCancel,
    onStartOver,
    isProcessing
}) {
    const totalDeleteSize = filesToDelete.reduce((sum, f) => sum + f.size, 0);
    const totalKeepSize = filesToKeep.reduce((sum, f) => sum + f.size, 0);

    return (
        <div className="min-h-screen flex flex-col items-center justify-start p-8 pt-24">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-display text-6xl font-extrabold tracking-tight mb-4 uppercase">
                        Review Your Choices
                    </h1>
                    <p className="font-mono text-lg opacity-80">
                        Files will be moved to <span className="font-bold">Scrubbed_Trash</span> folder
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Delete Summary */}
                    <div className="bg-sand border-2 border-ink shadow-hard-lg p-6">
                        <div className="text-xs opacity-60 mb-2 font-mono">TO DELETE</div>
                        <div className="text-4xl font-bold mb-2">{filesToDelete.length}</div>
                        <div className="font-mono text-sm">
                            {formatFileSize(totalDeleteSize)} to free
                        </div>
                    </div>

                    {/* Keep Summary */}
                    <div className="bg-sand border-2 border-ink shadow-hard-lg p-6">
                        <div className="text-xs opacity-60 mb-2 font-mono">TO KEEP</div>
                        <div className="text-4xl font-bold mb-2">{filesToKeep.length}</div>
                        <div className="font-mono text-sm">
                            {formatFileSize(totalKeepSize)} preserved
                        </div>
                    </div>
                </div>

                {/* Files to Delete List */}
                {filesToDelete.length > 0 && (
                    <div className="bg-sand border-2 border-ink shadow-hard-md p-6 mb-6 max-h-96 overflow-y-auto">
                        <h3 className="font-mono font-bold text-sm mb-4 uppercase">Files to Delete</h3>
                        <div className="space-y-2">
                            {filesToDelete.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-red-50 border border-ink-10"
                                >
                                    <span className="font-mono text-sm truncate flex-1">{file.name}</span>
                                    <span className="font-mono text-xs opacity-60 ml-4">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={onStartOver}
                        variant="secondary"
                        disabled={isProcessing}
                    >
                        Start Over
                    </Button>
                    <Button
                        onClick={onCancel}
                        variant="secondary"
                        disabled={isProcessing}
                    >
                        Go Back
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="danger"
                        disabled={isProcessing || filesToDelete.length === 0}
                    >
                        {isProcessing ? 'Moving Files...' : `Move ${filesToDelete.length} Files to Trash`}
                    </Button>
                </div>

                {/* Warning */}
                <div className="mt-8 p-4 bg-yellow-50 text-ink border-2 border-ink flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-mono text-sm text-left">
                        Files will be moved to <strong>_Scrubbed_Trash</strong> folder.
                        You can manually delete them later.
                    </p>
                </div>
            </div>
        </div>
    );
}
