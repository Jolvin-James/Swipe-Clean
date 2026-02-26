// File System Access API utilities

/**
 * Opens a directory picker and returns the directory handle
 */
export async function selectDirectory() {
    try {
        // Check if File System Access API is supported
        if (!('showDirectoryPicker' in window)) {
            throw new Error('File System Access API is not supported in this browser. Please use Chrome, Edge, or Opera.');
        }

        const dirHandle = await window.showDirectoryPicker({
            mode: 'readwrite', // We need write access to create trash folder
        });

        return dirHandle;
    } catch (error) {
        if (error.name === 'AbortError') {
            // User cancelled the picker
            return null;
        }
        throw error;
    }
}

/**
 * Loads all files from a directory (non-recursive)
 */
export async function loadFilesFromDirectory(dirHandle) {
    const files = [];

    try {
        for await (const entry of dirHandle.values()) {
            if (entry.kind === 'file') {
                const file = await entry.getFile();

                // Store both the file and its handle for later operations
                files.push({
                    file,
                    handle: entry,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                });
            }
        }

        return files;
    } catch (error) {
        console.error('Error loading files:', error);
        throw error;
    }
}

/**
 * Creates a preview URL for image files
 */
export async function getFilePreviewUrl(fileData) {
    const { file, type } = fileData;

    // Check if it's an image
    if (type.startsWith('image/')) {
        return URL.createObjectURL(file);
    }

    return null;
}

/**
 * Moves files to a _Scrubbed_Trash folder
 */
export async function moveFilesToTrash(dirHandle, filesToDelete) {
    try {
        // Create or get the trash folder
        const trashFolderName = '_Scrubbed_Trash';
        const trashHandle = await dirHandle.getDirectoryHandle(trashFolderName, { create: true });

        const results = {
            success: [],
            failed: [],
        };

        for (const fileData of filesToDelete) {
            try {
                const { handle, file } = fileData;

                // Create a new file in the trash folder
                const newFileHandle = await trashHandle.getFileHandle(file.name, { create: true });
                const writable = await newFileHandle.createWritable();

                // Write the file content
                await writable.write(file);
                await writable.close();

                // Delete the original file
                await dirHandle.removeEntry(file.name);

                results.success.push(file.name);
            } catch (error) {
                console.error(`Failed to move ${fileData.file.name}:`, error);
                results.failed.push({
                    name: fileData.file.name,
                    error: error.message,
                });
            }
        }

        return results;
    } catch (error) {
        console.error('Error creating trash folder:', error);
        throw error;
    }
}

/**
 * Revokes object URLs to free memory
 */
export function revokePreviewUrl(url) {
    if (url) {
        URL.revokeObjectURL(url);
    }
}
