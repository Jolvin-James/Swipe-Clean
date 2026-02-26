# SwipeClean

**Gamified Digital File Management**

SwipeClean is a privacy-focused, local-first web application that turns the tedious chore of cleaning your Downloads folder into a fun, dopamine-driven game. Swipe left to delete, swipe right to keep.

![SwipeClean](https://img.shields.io/badge/Status-MVP-green) ![Browser](https://img.shields.io/badge/Browser-Chrome%20%7C%20Edge%20%7C%20Opera-blue)

---

## Features

- **Gamified Interface**: Tinder-style swipe mechanics make file management fun
- **100% Private**: All processing happens locally in your browser - no uploads, no cloud, no tracking
- **Fast Workflow**: Keyboard-first controls for rapid file sorting
- **Beautiful Design**: Neo-brutalist aesthetic with hard shadows and clean typography
- **Undo Support**: Made a mistake? Press Ctrl+Z to undo your last action
- **Real-time Stats**: Track your progress and see how much storage you're freeing

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Chromium-based browser** (Chrome, Edge, or Opera)
  - Safari and Firefox do not support the File System Access API

### Installation

1. **Clone or download this repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Click "Select Folder to Clean"
   - Choose a folder (e.g., Downloads)
   - Start swiping!

---

## How to Use

### Swipe Controls

- **Swipe Left** or **← Arrow Key**: Mark file for deletion
- **Swipe Right** or **→ Arrow Key**: Keep file
- **Click/Space**: Expand file preview
- **Ctrl+Z**: Undo last action

### Workflow

1. **Select Folder**: Click "Select Folder to Clean" and choose a directory
2. **Sort Files**: Swipe through each file, deciding to keep or delete
3. **Review**: After sorting, review your choices
4. **Confirm**: Files marked for deletion are moved to `_Scrubbed_Trash` folder
5. **Done**: Manually delete the trash folder when ready

---

## Technical Architecture

### Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (custom design system)
- **Animations**: Framer Motion
- **File Access**: File System Access API

### Project Structure

```text
SwipeClean/
├── src/
│   ├── components/
│   │   ├── Button.jsx          # Neo-brutalist button component
│   │   ├── FileCard.jsx        # Swipeable card with drag gestures
│   │   ├── Stats.jsx           # Session statistics display
│   │   ├── WelcomeScreen.jsx   # Landing page
│   │   └── ReviewScreen.jsx    # Final review before execution
│   ├── utils/
│   │   ├── fileSystem.js       # File System Access API utilities
│   │   └── fileHelpers.js      # File processing helpers
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point
│   └── index.css               # Global styles + Tailwind
├── public/
├── index.html
├── tailwind.config.js          # Custom design system
├── vite.config.js
└── package.json
```

### Key Features Implementation

#### File System Access API
- Uses `window.showDirectoryPicker()` for folder selection
- Reads files with `FileSystemDirectoryHandle`
- Moves files by creating `_Scrubbed_Trash` subfolder

#### Swipe Physics
- Framer Motion drag gestures
- 150px threshold for swipe detection
- Rotation based on drag distance: `rotation = dragX * 0.05`
- Spring physics for natural movement

#### Visual Feedback
- **Delete state**: Grayscale filter + crosshatch overlay
- **Keep state**: 4px solid border
- **Real-time indicators**: Red "DELETE" / Green "KEEP" badges

---

## Design System

### Colors
- **Canvas**: Warm Sand (`#dacebb`)
- **Ink**: Void Black (`#000000`)
- **Ghost**: Ink 10% opacity
- **Shadow**: Ink 20% opacity

### Typography
- **Display**: Inter Tight (Extra Bold, 800)
- **Utility**: Space Mono (Medium, 500)

### Shadows
- Hard shadows with no blur
- `4px 4px 0px 0px #000000` (small)
- `8px 8px 0px 0px #000000` (medium)
- `12px 12px 0px 0px #000000` (large)

---

## Privacy & Security

- **No Server**: Everything runs in your browser
- **No Network Requests**: Files are never uploaded
- **No Analytics**: Zero tracking or telemetry
- **Local Only**: File System Access API keeps everything on your machine
- **Safe Deletion**: Files are moved to `_Scrubbed_Trash`, not permanently deleted

---

## Troubleshooting

### "File System Access API is not supported"
- **Solution**: Use Chrome, Edge, or Opera browser
- Safari and Firefox do not support this API

### Files not loading
- **Check permissions**: Ensure you granted folder access
- **Try another folder**: Some system folders may be restricted

### Swipe not working
- **Check browser**: Ensure you're using a supported browser
- **Use keyboard**: Try arrow keys instead

### Can't undo
- **History limit**: Undo only works for actions in current session
- **Already at start**: Can't undo if no actions taken

---

## Supported File Types

### Image Preview
- `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

### Icon Display
- **Documents**: `.pdf`, `.doc`, `.docx`, `.txt`
- **Archives**: `.zip`, `.rar`, `.7z`, `.tar`, `.gz`
- **Executables**: `.exe`, `.dmg`, `.app`, `.msi`
- **Video**: `.mp4`, `.mov`, `.avi`, `.mkv`
- **Audio**: `.mp3`, `.wav`, `.ogg`, `.flac`

---

## Roadmap

### Phase 1: MVP
- [x] Core swipe functionality
- [x] Image preview support
- [x] Keyboard navigation
- [x] Move to trash folder logic

### Phase 2: Polish (Coming Soon)
- [ ] Video file playback
- [ ] Audio sound effects
- [ ] Confetti animation on completion
- [ ] Dark mode toggle

### Phase 3: Pro Features (Future)
- [ ] Duplicate detection (file hashing)
- [ ] Sort by file size
- [ ] PWA installation support
- [ ] Batch operations

---

## License

This project is open source and available under the MIT License.

---

## Acknowledgments

- Design inspired by neo-brutalist and Swiss minimalist aesthetics
- Built with modern web technologies
- Powered by the File System Access API

---

## Tips

- **Start small**: Try with a folder of 10-20 files first
- **Use keyboard**: Arrow keys are faster than mouse dragging
- **Review carefully**: Always check the review screen before confirming
- **Empty trash manually**: Remember to delete `_Scrubbed_Trash` when ready
