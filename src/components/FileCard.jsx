import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { formatFileSize, isImageFile, getFileIcon, getFileExtension } from '../utils/fileHelpers';
import { getFilePreviewUrl, revokePreviewUrl } from '../utils/fileSystem';

/**
 * FileCard Component - Main swipeable card
 */
export default function FileCard({ fileData, onSwipe }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [imageDimensions, setImageDimensions] = useState(null);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Calculate optimal card dimensions based on image
    const getCardDimensions = () => {
        if (!imageDimensions) {
            // Default dimensions for non-images or before image loads
            return {
                width: 500,
                height: 600,
                maxHeight: 600,
                previewHeight: 450
            };
        }

        const { width: imgWidth, height: imgHeight } = imageDimensions;
        const footerHeight = 80; // Approximate footer height
        const maxWidth = 500;

        const safePreviewHeight = typeof window !== 'undefined' ? Math.max(150, window.innerHeight - 280) : 450;
        const maxPreviewHeight = Math.min(450, safePreviewHeight);

        // Calculate aspect ratio
        const aspectRatio = imgWidth / imgHeight;

        // Calculate dimensions that fit the image perfectly
        let previewWidth = maxWidth;
        let previewHeight = previewWidth / aspectRatio;

        // If height exceeds max, scale down
        if (previewHeight > maxPreviewHeight) {
            previewHeight = maxPreviewHeight;
            previewWidth = previewHeight * aspectRatio;
        }

        return {
            width: Math.min(previewWidth, maxWidth),
            height: previewHeight + footerHeight,
            maxHeight: 600,
            previewHeight: previewHeight
        };
    };

    const cardDimensions = getCardDimensions();

    // Handle image load to get dimensions
    const handleImageLoad = (e) => {
        const img = e.target;
        setImageDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight
        });
    };

    // Load preview for images
    useEffect(() => {
        let url = null;

        async function loadPreview() {
            if (isImageFile(fileData.type)) {
                url = await getFilePreviewUrl(fileData);
                setPreviewUrl(url);
            }
        }

        // Reset dimensions for new file
        setImageDimensions(null);
        loadPreview();

        // Cleanup: revoke URL when component unmounts
        return () => {
            if (url) {
                revokePreviewUrl(url);
            }
        };
    }, [fileData]);

    const handleDragEnd = (event, info) => {
        const threshold = 150;

        if (Math.abs(info.offset.x) > threshold) {
            const direction = info.offset.x > 0 ? 'keep' : 'delete';
            onSwipe(direction);
        }
    };

    // Determine visual feedback based on drag position
    const currentX = x.get();
    const isDeleting = currentX < -50;
    const isKeeping = currentX > 50;

    return (
        <motion.div
            className="absolute"
            style={{
                x,
                rotate,
                opacity,
                left: '50%',
                top: '50%',
                translateX: '-50%',
                translateY: '-50%'
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing' }}
        >
            <div
                className={`
          relative bg-sand border-2 border-ink shadow-hard-lg 
          transition-all duration-300 cursor-grab active:cursor-grabbing
          ${isDeleting ? 'grayscale contrast-125' : ''}
          ${isKeeping ? 'ring-4 ring-ink' : ''}
        `}
                style={{
                    width: `${cardDimensions.width}px`,
                    height: cardDimensions.height === 'auto' ? 'auto' : `${cardDimensions.height}px`,
                    maxHeight: typeof cardDimensions.maxHeight === 'number' ? `${cardDimensions.maxHeight}px` : cardDimensions.maxHeight
                }}
            >
                {/* Delete/Keep Indicators */}
                {isDeleting && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 font-mono font-bold text-sm z-10 border-2 border-ink">
                        DELETE
                    </div>
                )}

                {/* File Preview Area */}
                <div
                    className="flex items-center justify-center bg-ink-10 overflow-hidden transition-all duration-300"
                    style={{
                        height: typeof cardDimensions.previewHeight === 'number'
                            ? `${cardDimensions.previewHeight}px`
                            : cardDimensions.previewHeight
                    }}
                >
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt={fileData.name}
                            className="w-full h-full object-contain"
                            style={{ pointerEvents: 'none' }}
                            onLoad={handleImageLoad}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <FileIconDisplay type={getFileIcon(fileData.name, fileData.type)} />
                            <div className="mt-4 font-mono text-sm opacity-60">
                                {getFileExtension(fileData.name)}
                            </div>
                        </div>
                    )}
                </div>

                {/* File Info Footer */}
                <div className="border-t-2 border-ink p-4 bg-sand">
                    <div className="flex justify-between items-center">
                        <div className="flex-1 min-w-0">
                            <div className="font-mono text-sm font-bold truncate">
                                {fileData.name}
                            </div>
                            <div className="font-mono text-xs opacity-60 mt-1">
                                {formatFileSize(fileData.size)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Crosshatch overlay for delete state */}
                {isDeleting && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(0,0,0,0.1) 10px,
                rgba(0,0,0,0.1) 20px
              )`
                        }}
                    />
                )}
            </div>
        </motion.div>
    );
}

/**
 * File Icon Display Component
 */
function FileIconDisplay({ type }) {
    const icons = {
        document: (
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        archive: (
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
        ),
        executable: (
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        video: (
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        ),
        audio: (
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
        ),
        generic: (
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
        ),
    };

    return icons[type] || icons.generic;
}
