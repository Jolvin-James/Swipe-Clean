import React, { useState, useEffect, useCallback } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import FileCard from './components/FileCard';
import Stats from './components/Stats';
import ReviewScreen from './components/ReviewScreen';
import Button from './components/Button';
import { selectDirectory, loadFilesFromDirectory, moveFilesToTrash } from './utils/fileSystem';
import { calculateTotalSize } from './utils/fileHelpers';
import './index.css';

function App() {
  // Application state
  const [screen, setScreen] = useState('welcome'); // 'welcome', 'sorting', 'review', 'complete'
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dirHandle, setDirHandle] = useState(null);

  // Action tracking
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [keptFiles, setKeptFiles] = useState([]);
  const [history, setHistory] = useState([]); // For undo functionality

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle folder selection
   */
  const handleSelectFolder = async () => {
    try {
      setError(null);
      const handle = await selectDirectory();

      if (!handle) {
        return; // User cancelled
      }

      setDirHandle(handle);

      // Load files from directory
      const loadedFiles = await loadFilesFromDirectory(handle);

      if (loadedFiles.length === 0) {
        setError('No files found in the selected folder.');
        return;
      }

      setFiles(loadedFiles);
      setCurrentIndex(0);
      setDeletedFiles([]);
      setKeptFiles([]);
      setHistory([]);
      setScreen('sorting');
    } catch (err) {
      console.error('Error selecting folder:', err);
      setError(err.message || 'Failed to load folder. Please try again.');
    }
  };

  /**
   * Handle swipe action
   */
  const handleSwipe = useCallback((direction) => {
    if (currentIndex >= files.length) return;

    const currentFile = files[currentIndex];

    // Save to history for undo
    setHistory(prev => [...prev, {
      index: currentIndex,
      action: direction,
      file: currentFile
    }]);

    if (direction === 'delete') {
      setDeletedFiles(prev => [...prev, currentFile]);
    } else {
      setKeptFiles(prev => [...prev, currentFile]);
    }

    // Move to next file immediately for both actions so it stays responsive
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, files]);

  /**
   * Handle keyboard controls
   */
  useEffect(() => {
    if (screen !== 'sorting') return;

    const handleKeyDown = (e) => {
      // Prevent default for arrow keys
      if (['ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }

      switch (e.code) {
        case 'ArrowLeft':
          handleSwipe('delete');
          break;
        case 'ArrowRight':
          handleSwipe('keep');
          break;
        case 'KeyZ':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            handleUndo();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, handleSwipe]);

  /**
   * Handle undo
   */
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;

    const lastAction = history[history.length - 1];

    // Remove from history
    setHistory(prev => prev.slice(0, -1));

    // Remove from respective list
    if (lastAction.action === 'delete') {
      setDeletedFiles(prev => prev.slice(0, -1));
    } else {
      setKeptFiles(prev => prev.slice(0, -1));
    }

    // Go back to previous file
    setCurrentIndex(lastAction.index);
  }, [history]);

  /**
   * Handle finish sorting
   */
  const handleFinish = () => {
    setScreen('review');
  };

  /**
   * Handle confirm deletion
   */
  const handleConfirmDelete = async () => {
    if (deletedFiles.length === 0) return;

    setIsProcessing(true);
    try {
      const results = await moveFilesToTrash(dirHandle, deletedFiles);

      if (results.failed.length > 0) {
        console.warn('Some files failed to move:', results.failed);
      }

      setScreen('complete');
    } catch (err) {
      console.error('Error moving files:', err);
      setError(err.message || 'Failed to move files to trash.');
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle cancel review
   */
  const handleCancelReview = () => {
    setScreen('sorting');
  };

  /**
   * Reset and start over
   */
  const handleStartOver = () => {
    setScreen('welcome');
    setFiles([]);
    setCurrentIndex(0);
    setDeletedFiles([]);
    setKeptFiles([]);
    setHistory([]);
    setDirHandle(null);
    setError(null);
  };

  // Calculate stats
  const totalStorageToSave = calculateTotalSize(deletedFiles);
  const isComplete = currentIndex >= files.length;

  // Render different screens
  if (screen === 'welcome') {
    return (
      <>
        <WelcomeScreen onSelectFolder={handleSelectFolder} />
        {error && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-red-100 border-2 border-red-600 p-4 max-w-md">
            <p className="font-mono text-sm text-red-800">{error}</p>
          </div>
        )}
      </>
    );
  }

  if (screen === 'review') {
    return (
      <ReviewScreen
        filesToDelete={deletedFiles}
        filesToKeep={keptFiles}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelReview}
        onStartOver={handleStartOver}
        isProcessing={isProcessing}
      />
    );
  }

  if (screen === 'complete') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <h1 className="font-display text-7xl font-extrabold tracking-tight mb-6 uppercase">
            All Done!
          </h1>
          <div className="bg-sand border-2 border-ink shadow-hard-lg p-8 mb-8">
            <div className="flex justify-center mb-6">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-mono text-xl mb-4">
              Successfully moved {deletedFiles.length} files to trash
            </p>
            <p className="font-mono text-lg opacity-80">
              Freed up {calculateTotalSize(deletedFiles) > 0 &&
                `${(calculateTotalSize(deletedFiles) / 1024 / 1024).toFixed(2)} MB`}
            </p>
          </div>
          <Button onClick={handleStartOver} variant="primary">
            Clean Another Folder
          </Button>
        </div>
      </div>
    );
  }

  // Sorting screen
  return (
    <main className="min-h-screen relative">
      {/* Stats */}
      <Stats
        totalFiles={files.length}
        currentIndex={currentIndex}
        deletedCount={deletedFiles.length}
        keptCount={keptFiles.length}
        storageToSave={totalStorageToSave}
      />

      {/* Main card area */}
      <div className="flex items-center justify-center min-h-screen p-8">
        {!isComplete ? (
          <div className="relative" style={{ minWidth: '500px', minHeight: '600px', width: '100%', maxWidth: '900px' }}>
            {/* Show current card */}
            {currentIndex < files.length && (
              <FileCard
                key={currentIndex}
                fileData={files[currentIndex]}
                onSwipe={handleSwipe}
              />
            )}
          </div>
        ) : (
          <div className="text-center">
            <h2 className="font-display text-5xl font-extrabold mb-6 uppercase">
              All Files Sorted!
            </h2>
            <p className="font-mono text-lg mb-8">
              Ready to review your choices?
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={handleUndo} variant="secondary" disabled={history.length === 0}>
                Undo Last Action
              </Button>
              <Button onClick={handleFinish} variant="primary">
                Review & Finish
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {!isComplete && (
        <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
          <Button onClick={() => handleSwipe('delete')} variant="danger">
            ← Delete
          </Button>
          <Button
            onClick={handleUndo}
            variant="secondary"
            disabled={history.length === 0}
          >
            Undo (Ctrl+Z)
          </Button>
          <Button onClick={() => handleSwipe('keep')} variant="primary">
            Keep →
          </Button>
        </nav>
      )}

      {/* Finish Early and Start Over Buttons */}
      {!isComplete && (
        <div className="fixed bottom-8 right-8 flex gap-4 z-50">
          <Button onClick={handleStartOver} variant="secondary">
            Change Folder
          </Button>
          <Button onClick={handleFinish} variant="secondary">
            Finish Early
          </Button>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-red-100 border-2 border-red-600 p-4 max-w-md z-50">
          <p className="font-mono text-sm text-red-800">{error}</p>
        </div>
      )}
    </main>
  );
}

export default App;
