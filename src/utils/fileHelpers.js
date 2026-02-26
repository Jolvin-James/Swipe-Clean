// File processing helper functions

/**
 * Formats file size from bytes to human-readable format
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Checks if a file is an image based on its type
 */
export function isImageFile(fileType) {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return imageTypes.includes(fileType);
}

/**
 * Gets the appropriate icon name for a file type
 */
export function getFileIcon(fileName, fileType) {
    const extension = fileName.split('.').pop().toLowerCase();

    // Image files
    if (fileType.startsWith('image/')) {
        return 'image';
    }

    // Document files
    if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(extension)) {
        return 'document';
    }

    // Archive files
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
        return 'archive';
    }

    // Executable files
    if (['exe', 'dmg', 'app', 'msi'].includes(extension)) {
        return 'executable';
    }

    // Video files
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) {
        return 'video';
    }

    // Audio files
    if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(extension)) {
        return 'audio';
    }

    return 'generic';
}

/**
 * Calculates total size of an array of files
 */
export function calculateTotalSize(files) {
    return files.reduce((total, file) => total + file.size, 0);
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(fileName) {
    return fileName.split('.').pop().toUpperCase();
}
