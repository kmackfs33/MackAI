# Mack AI macOS Application - Developer Documentation

## Project Overview

This document provides technical information about the Mack AI macOS application, its architecture, and implementation details.

## Technology Stack

- **Electron**: Framework for creating native applications with web technologies
- **HTML/CSS/JavaScript**: Frontend implementation
- **Node.js**: Backend runtime
- **electron-builder**: Packaging and distribution

## Project Structure

```
mack_ai_electron/
├── build/                  # Build resources
│   ├── entitlements.mac.plist  # macOS entitlements
│   ├── icon.icns           # Application icon
│   └── background.png      # DMG background
├── dist/                   # Distribution output
├── src/                    # Source code
│   ├── css/                # Stylesheets
│   │   ├── styles.css      # Main styles
│   │   └── themes.css      # Theme definitions
│   ├── js/                 # JavaScript
│   │   └── app.js          # Main application logic
│   ├── icons/              # Application icons
│   └── index.html          # Main HTML
├── main.js                 # Electron main process
├── preload.js              # Preload script for security
├── package.json            # Project configuration
├── build.sh                # Build script
├── test.sh                 # Test script
└── create_dmg.sh           # DMG creation script
```

## Architecture

The application follows Electron's two-process architecture:

1. **Main Process** (main.js):
   - Controls application lifecycle
   - Creates browser windows
   - Implements native macOS features (Touch Bar, menus)
   - Handles IPC communication with renderer
   - Manages file system operations

2. **Renderer Process** (src/):
   - Implements the user interface
   - Handles user interactions
   - Communicates with main process via IPC

## macOS-Specific Features

### Touch Bar Integration
The application implements custom Touch Bar support with context-aware buttons for navigation, search, and voice input.

```javascript
// Touch Bar implementation in main.js
function setupTouchBar() {
  const touchBar = new TouchBar({
    items: [
      dashboardButton,
      new TouchBarSpacer({ size: 'small' }),
      conversationButton,
      // ...other buttons
    ]
  });
  mainWindow.setTouchBar(touchBar);
}
```

### Native Menu
Full macOS menu implementation with application-specific commands and standard macOS menu items.

### System Theme Integration
The application detects and responds to macOS light/dark mode changes:

```javascript
// System theme detection in main.js
nativeTheme.on('updated', () => {
  const isDarkMode = nativeTheme.shouldUseDarkColors;
  mainWindow.webContents.send('system-theme-changed', isDarkMode ? 'dark' : 'light');
});
```

### Global Shortcuts
System-wide keyboard shortcuts for quick access:

```javascript
// Global shortcuts in main.js
globalShortcut.register('CommandOrControl+Shift+Space', () => {
  // Activate app
});

globalShortcut.register('Alt+Space', () => {
  // Quick voice input
});
```

### Native Notifications
Integration with macOS notification system:

```javascript
// Native notifications in main.js
function showNotification(title, body) {
  const notification = new Notification({
    title: title,
    body: body,
    silent: false
  });
  notification.show();
}
```

## Security Considerations

### Entitlements
The application uses the following entitlements for macOS:
- `com.apple.security.cs.allow-jit`: For JavaScript JIT compilation
- `com.apple.security.network.client`: For network access
- `com.apple.security.files.user-selected.read-write`: For file access
- `com.apple.security.device.microphone`: For speech recognition

### Context Isolation
The application uses Electron's context isolation feature to prevent direct access to Node.js APIs from renderer process:

```javascript
// Context isolation in main.js
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  nodeIntegration: false,
  contextIsolation: true,
}
```

### IPC Communication
Secure IPC communication with channel whitelisting:

```javascript
// IPC security in preload.js
contextBridge.exposeInMainWorld(
  'api', {
    send: (channel, data) => {
      const validChannels = ['app-ready', 'app-close', /* other channels */];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    // ...
  }
);
```

## Build Process

The build process is managed by electron-builder and consists of the following steps:

1. Install dependencies
2. Prepare build resources (icons, entitlements)
3. Build the application
4. Package as DMG for macOS
5. Sign and notarize (in production environment)

## Testing

The application includes automated tests for:
- Application startup
- Build configuration validation
- Required file verification

## Distribution

The application is distributed as a .dmg file with the following features:
- Custom background image
- Applications folder shortcut for easy installation
- Code signing and notarization for security

## Future Enhancements

Planned future enhancements include:
- Apple Silicon optimization
- iCloud integration
- Handoff support with iOS devices
- Spotlight search integration
- Menu bar mini mode

## Troubleshooting

Common issues and solutions:
- **Application won't start**: Check macOS version compatibility
- **Missing permissions**: Ensure proper entitlements are granted
- **Touch Bar not working**: Verify Touch Bar support on device
- **Dark mode issues**: Check system appearance settings
