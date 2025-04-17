const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    send: (channel, data) => {
      // Whitelist channels
      const validChannels = [
        'app-ready', 
        'app-close',
        'app-minimize',
        'app-maximize',
        'new-conversation', 
        'new-project', 
        'open-file',
        'save-file',
        'export-file',
        'toggle-sidebar',
        'toggle-voice'
      ];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = [
        'navigate', 
        'focus-search', 
        'toggle-voice', 
        'open-preferences',
        'new-conversation',
        'new-project',
        'file-opened',
        'file-saved',
        'find',
        'start-speaking',
        'stop-speaking',
        'toggle-sidebar',
        'set-theme',
        'open-documentation',
        'open-shortcuts',
        'send-feedback',
        'check-updates'
      ];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    // Expose any required Node.js APIs or modules
    platform: process.platform,
    // Add macOS-specific APIs
    isMac: process.platform === 'darwin',
    // Add system theme detection
    isDarkMode: () => {
      if (process.platform === 'darwin') {
        const { nativeTheme } = require('electron');
        return nativeTheme.shouldUseDarkColors;
      }
      return false;
    }
  }
);
