const { app, BrowserWindow, Menu, TouchBar, ipcMain, dialog, nativeTheme, Notification, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { TouchBarButton, TouchBarSpacer } = TouchBar;

// Configurations
const APP_CONFIG = {
  mainWindow: {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset', // macOS-specific
    trafficLightPosition: { x: 20, y: 20 },
    vibrancy: process.platform === 'darwin' ? 'under-window' : undefined,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  },
  shortcuts: {
    activateApp: 'CommandOrControl+Shift+Space',
    voiceInput: 'Alt+Space'
  }
};

let mainWindow;

// Main Process Setup
const initializeApp = async () => {
  app.whenReady().then(createMainWindow);
  registerAppLifecycleHandlers();
};

const createMainWindow = () => {
  mainWindow = new BrowserWindow(APP_CONFIG.mainWindow);
  loadApplicationContent();
  configurePlatformSpecificFeatures();
  registerGlobalShortcuts();
  setupIPCHandlers();
};

// Content Loading
const loadApplicationContent = () => {
  mainWindow.loadFile(path.join(__dirname, 'src/index.html'));
  
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
};

// Platform-Specific Features
const configurePlatformSpecificFeatures = () => {
  if (process.platform === 'darwin') {
    setupMacOSFeatures();
  }
};

const setupMacOSFeatures = () => {
  setupTouchBar();
  setupMenu();
  setupThemeListener();
};

// TouchBar Configuration
const setupTouchBar = () => {
  const touchBarItems = [
    createTouchBarButton('🏠 Dashboard', '#2563EB', 'navigate', 'dashboard'),
    new TouchBarSpacer({ size: 'small' }),
    createTouchBarButton('💬 Conversation', '#3B82F6', 'navigate', 'conversation'),
    new TouchBarSpacer({ size: 'small' }),
    createTouchBarButton('📝 Code', '#3B82F6', 'navigate', 'code'),
    new TouchBarSpacer({ size: 'small' }),
    createTouchBarButton('🔍 Search', '#3B82F6', 'focus-search'),
    new TouchBarSpacer({ size: 'small' }),
    createTouchBarButton('🎤 Voice', '#3B82F6', 'toggle-voice')
  ];

  mainWindow.setTouchBar(new TouchBar({ items: touchBarItems }));
};

const createTouchBarButton = (label, color, event, payload) => {
  return new TouchBarButton({
    label,
    backgroundColor: color,
    click: () => mainWindow.webContents.send(event, payload)
  });
};

// Menu Configuration
const setupMenu = () => {
  const menuTemplate = generateMenuTemplate();
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
};

const generateMenuTemplate = () => {
  const isMac = process.platform === 'darwin';
  const separator = { type: 'separator' };

  return [
    {
      label: 'Mack AI',
      submenu: [
        { role: 'about' },
        separator,
        createMenuItem('Preferences...', 'CommandOrControl+,', 'open-preferences'),
        separator,
        ...(isMac ? [
          { role: 'services' },
          separator,
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          separator
        ] : []),
        { role: 'quit' }
      ]
    },
    createFileMenu(),
    createEditMenu(),
    createViewMenu(),
    createWindowMenu(),
    createHelpMenu()
  ];
};

const createFileMenu = () => ({
  label: 'File',
  submenu: [
    createMenuItem('New Conversation', 'CommandOrControl+N', 'new-conversation'),
    createMenuItem('New Project', 'Shift+CommandOrControl+N', 'new-project'),
    { type: 'separator' },
    createMenuItem('Open...', 'CommandOrControl+O', 'open-file'),
    createMenuItem('Save', 'CommandOrControl+S', 'save-file'),
    createMenuItem('Export...', 'Shift+CommandOrControl+E', 'export-file')
  ]
});

const createEditMenu = () => ({
  label: 'Edit',
  submenu: [
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { role: 'delete' },
    { role: 'selectAll' },
    { type: 'separator' },
    createMenuItem('Find', 'CommandOrControl+F', 'find'),
    { type: 'separator' },
    {
      label: 'Speech',
      submenu: [
        createMenuItem('Start Speaking', '', 'start-speaking'),
        createMenuItem('Stop Speaking', '', 'stop-speaking')
      ]
    }
  ]
});

// Additional menu creation functions omitted for brevity...

// IPC Handlers
const setupIPCHandlers = () => {
  ipcMain.handle('get-system-theme', () => 
    nativeTheme.shouldUseDarkColors ? 'dark' : 'light'
  );

  ipcMain.on('app-close', handleWindowClose);
  ipcMain.on('app-minimize', handleWindowMinimize);
  ipcMain.on('app-maximize', handleWindowMaximize);
  
  setupFileHandlers();
  setupNotificationHandler();
};

const setupFileHandlers = () => {
  ipcMain.handle('open-file', handleFileOpen);
  ipcMain.handle('save-file', handleFileSave);
};

const handleFileOpen = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'md'] },
      { name: 'Code Files', extensions: ['py', 'js', 'html', 'css'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled || !filePaths.length) return null;

  try {
    const content = await fs.readFile(filePaths[0], 'utf8');
    return { path: filePaths[0], content };
  } catch (error) {
    console.error('File open error:', error);
    throw new Error('Failed to open file');
  }
};

const handleFileSave = async (_, { path: filePath, content }) => {
  const { canceled, filePath: savedPath } = await dialog.showSaveDialog({
    defaultPath: filePath || 'untitled.txt',
    filters: [
      { name: 'Text Files', extensions: ['txt', 'md'] },
      { name: 'Code Files', extensions: ['py', 'js', 'html', 'css'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled || !savedPath) return null;

  try {
    await fs.writeFile(savedPath, content, 'utf8');
    if (process.platform === 'darwin') {
      showNotification('File Saved', `Saved to ${path.basename(savedPath)}`);
    }
    return { path: savedPath };
  } catch (error) {
    console.error('File save error:', error);
    throw new Error('Failed to save file');
  }
};

// Utility Functions
const createMenuItem = (label, accelerator, event, payload) => ({
  label,
  accelerator,
  click: () => mainWindow.webContents.send(event, payload)
});

const showNotification = (title, body) => {
  if (!Notification.isSupported()) return;

  const notification = new Notification({
    title,
    body,
    silent: true,
    icon: path.join(__dirname, 'src/icons/app-icon.png')
  });

  notification.on('click', () => focusMainWindow());
  notification.show();
};

const focusMainWindow = () => {
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.focus();
};

// App Lifecycle Management
const registerAppLifecycleHandlers = () => {
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('activate', () => {
    if (!BrowserWindow.getAllWindows().length) createMainWindow();
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
};

// Initialize the application
initializeApp().catch((error) => {
  console.error('Application initialization failed:', error);
  process.exit(1);
});

module.exports = { createMainWindow };