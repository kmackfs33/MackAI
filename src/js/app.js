// Main application JavaScript for Mack AI macOS app
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the application
  initApp();
  
  // Set up event listeners
  setupEventListeners();
  
  // Apply system theme
  applySystemTheme();
  
  // Enable macOS-specific features
  enableMacOSFeatures();
  
  // Notify main process that app is ready
  if (window.api) {
    window.api.send('app-ready');
  }
});

// Initialize the application
function initApp() {
  console.log('Initializing Mack AI application');
  
  // Add vibrancy effects for macOS
  document.querySelector('.sidebar').classList.add('vibrancy-effect');
  document.querySelector('.titlebar').classList.add('vibrancy-effect');
  
  // Set up traffic light controls (macOS window controls)
  setupTrafficLights();
}

// Set up event listeners
function setupEventListeners() {
  // Navigation items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      // Remove active class from all nav items
      document.querySelectorAll('.nav-item').forEach(navItem => {
        navItem.classList.remove('active');
      });
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Handle navigation based on item text
      const itemText = item.querySelector('span').textContent;
      handleNavigation(itemText);
    });
  });
  
  // Theme toggle in settings (will be implemented in settings panel)
  document.querySelector('.settings-button').addEventListener('click', () => {
    toggleSettingsPanel();
  });
  
  // Search functionality
  const searchInput = document.querySelector('.search-input');
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });
  
  document.querySelector('.search-button').addEventListener('click', () => {
    performSearch(searchInput.value);
  });
  
  // Listen for IPC messages from main process
  if (window.api) {
    // Navigation events
    window.api.receive('navigate', (view) => {
      navigateToView(view);
    });
    
    // Focus search
    window.api.receive('focus-search', () => {
      document.querySelector('.search-input').focus();
    });
    
    // Toggle sidebar
    window.api.receive('toggle-sidebar', () => {
      toggleSidebar();
    });
    
    // Theme changes
    window.api.receive('set-theme', (theme) => {
      setTheme(theme);
    });
    
    // Other IPC events
    setupIPCListeners();
  }
}

// Set up traffic light controls (macOS window controls)
function setupTrafficLights() {
  const closeButton = document.querySelector('.traffic-light.close');
  const minimizeButton = document.querySelector('.traffic-light.minimize');
  const maximizeButton = document.querySelector('.traffic-light.maximize');
  
  if (closeButton && window.api) {
    closeButton.addEventListener('click', () => {
      window.api.send('app-close');
    });
  }
  
  if (minimizeButton && window.api) {
    minimizeButton.addEventListener('click', () => {
      window.api.send('app-minimize');
    });
  }
  
  if (maximizeButton && window.api) {
    maximizeButton.addEventListener('click', () => {
      window.api.send('app-maximize');
    });
  }
}

// Handle navigation based on item text
function handleNavigation(itemText) {
  // Clear main content
  const contentArea = document.querySelector('.content');
  
  // Load appropriate view based on navigation item
  switch(itemText) {
    case 'Dashboard':
      loadDashboardView(contentArea);
      break;
    case 'General':
    case 'Code':
    case 'Research':
      loadConversationView(contentArea, itemText.toLowerCase());
      break;
    case 'Web Development':
    case 'Data Analysis':
    case 'New Project':
      loadProjectView(contentArea, itemText);
      break;
    case 'Code Editor':
      loadCodeEditorView(contentArea);
      break;
    case 'Neural Network':
      loadNeuralNetworkView(contentArea);
      break;
    case 'Speech Synthesis':
      loadSpeechSynthesisView(contentArea);
      break;
    default:
      console.log('Unknown navigation item:', itemText);
  }
}

// Navigate to a specific view
function navigateToView(view) {
  // Find the corresponding nav item and click it
  const navItems = document.querySelectorAll('.nav-item');
  for (const item of navItems) {
    const itemText = item.querySelector('span').textContent;
    if (itemText.toLowerCase() === view.toLowerCase()) {
      item.click();
      return;
    }
  }
  
  console.log('View not found:', view);
}

// Toggle sidebar visibility
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const currentWidth = sidebar.style.width;
  
  if (!currentWidth || currentWidth === '240px') {
    sidebar.style.width = '60px';
    document.querySelectorAll('.nav-item span, .nav-section-title').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.nav-item').forEach(el => {
      el.style.justifyContent = 'center';
      el.style.padding = 'var(--spacing-md) 0';
    });
  } else {
    sidebar.style.width = '240px';
    document.querySelectorAll('.nav-item span, .nav-section-title').forEach(el => {
      el.style.display = '';
    });
    document.querySelectorAll('.nav-item').forEach(el => {
      el.style.justifyContent = '';
      el.style.padding = '';
    });
  }
}

// Apply system theme based on OS preference
function applySystemTheme() {
  // Check if we're on macOS and can detect system theme
  if (window.api && window.api.isMac) {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.add('theme-system');
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    }
    
    // Listen for changes in system theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (document.body.classList.contains('theme-system')) {
        if (e.matches) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      }
    });
  }
}

// Set theme manually
function setTheme(theme) {
  // Remove all theme classes
  document.body.classList.remove('theme-light', 'theme-dark', 'theme-system', 'dark-mode');
  
  // Apply selected theme
  switch(theme) {
    case 'light':
      document.body.classList.add('theme-light');
      break;
    case 'dark':
      document.body.classList.add('theme-dark');
      break;
    case 'system':
      document.body.classList.add('theme-system');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
      }
      break;
  }
  
  // Save preference
  localStorage.setItem('theme', theme);
}

// Toggle settings panel
function toggleSettingsPanel() {
  // This will be implemented as a modal or slide-in panel
  console.log('Settings panel toggled');
  
  // For now, just cycle through themes as a demo
  const currentTheme = localStorage.getItem('theme') || 'system';
  let newTheme;
  
  switch(currentTheme) {
    case 'light':
      newTheme = 'dark';
      break;
    case 'dark':
      newTheme = 'system';
      break;
    default:
      newTheme = 'light';
  }
  
  setTheme(newTheme);
}

// Perform search
function performSearch(query) {
  if (!query) return;
  
  console.log('Searching for:', query);
  // Implement search functionality
  // This would typically query the backend or local data
}

// Enable macOS-specific features
function enableMacOSFeatures() {
  if (window.api && window.api.isMac) {
    console.log('Enabling macOS-specific features');
    
    // Add macOS-specific CSS class
    document.body.classList.add('macos');
    
    // Set up Touch Bar support via IPC
    setupTouchBarSupport();
  }
}

// Set up Touch Bar support
function setupTouchBarSupport() {
  // This is handled via IPC with the main process
  console.log('Touch Bar support enabled');
}

// Set up additional IPC listeners
function setupIPCListeners() {
  // New conversation
  window.api.receive('new-conversation', () => {
    console.log('Creating new conversation');
    navigateToView('general');
    // Implement new conversation creation
  });
  
  // New project
  window.api.receive('new-project', () => {
    console.log('Creating new project');
    navigateToView('new project');
    // Implement new project creation
  });
  
  // Open file
  window.api.receive('open-file', () => {
    console.log('Opening file');
    // Implement file opening
  });
  
  // Save file
  window.api.receive('save-file', () => {
    console.log('Saving file');
    // Implement file saving
  });
  
  // Export file
  window.api.receive('export-file', () => {
    console.log('Exporting file');
    // Implement file export
  });
  
  // Find
  window.api.receive('find', () => {
    console.log('Finding in current view');
    // Implement find functionality
  });
  
  // Speech
  window.api.receive('start-speaking', () => {
    console.log('Starting speech');
    // Implement speech synthesis
  });
  
  window.api.receive('stop-speaking', () => {
    console.log('Stopping speech');
    // Implement speech synthesis stop
  });
  
  // Documentation
  window.api.receive('open-documentation', () => {
    console.log('Opening documentation');
    // Implement documentation view
  });
  
  // Keyboard shortcuts
  window.api.receive('open-shortcuts', () => {
    console.log('Opening keyboard shortcuts');
    // Implement keyboard shortcuts view
  });
  
  // Feedback
  window.api.receive('send-feedback', () => {
    console.log('Sending feedback');
    // Implement feedback form
  });
  
  // Updates
  window.api.receive('check-updates', () => {
    console.log('Checking for updates');
    // Implement update check
  });
  
  // Preferences
  window.api.receive('open-preferences', () => {
    console.log('Opening preferences');
    // Implement preferences panel
  });
}

// View loading functions
function loadDashboardView(container) {
  // Dashboard view is already in the HTML
  console.log('Loading dashboard view');
}

function loadConversationView(container, type) {
  console.log(`Loading ${type} conversation view`);
  
  // Create conversation view
  container.innerHTML = `
    <div class="conversation-view">
      <h1>Conversation: ${type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      
      <div class="conversation-container">
        <div class="message-list">
          <div class="message ai">
            <div class="message-avatar">M</div>
            <div class="message-content">
              <div class="message-text">Hello! How can I help you today?</div>
              <div class="message-time">10:42 AM</div>
            </div>
          </div>
          
          <div class="message user">
            <div class="message-content">
              <div class="message-text">I need help with a project.</div>
              <div class="message-time">10:43 AM</div>
            </div>
            <div class="message-avatar">U</div>
          </div>
          
          <div class="message ai">
            <div class="message-avatar">M</div>
            <div class="message-content">
              <div class="message-text">I'd be happy to help! What kind of project are you working on?</div>
              <div class="message-time">10:43 AM</div>
            </div>
          </div>
        </div>
        
        <div class="message-input-container">
          <textarea class="message-input" placeholder="Type your message..."></textarea>
          <div class="message-actions">
            <button class="attachment-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
              </svg>
            </button>
            <button class="voice-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </button>
            <button class="send-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add styles if not already in the document
  if (!document.querySelector('style#conversation-styles')) {
    const style = document.createElement('style');
    style.id = 'conversation-styles';
    style.textContent = `
      .conversation-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 150px);
      }
      
      .message-list {
        flex: 1;
        overflow-y: auto;
        padding: var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }
      
      .message {
        display: flex;
        gap: var(--spacing-md);
        max-width: 80%;
      }
      
      .message.ai {
        align-self: flex-start;
      }
      
      .message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }
      
      .message-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: var(--accent-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
      }
      
      .message.user .message-avatar {
        background-color: var(--tertiary-bg);
        color: var(--primary-text);
      }
      
      .message-content {
        background-color: var(--secondary-bg);
        padding: var(--spacing-md);
        border-radius: var(--radius-lg);
        border-top-left-radius: ${type === 'ai' ? '0' : 'var(--radius-lg)'};
        border-top-right-radius: ${type === 'user' ? '0' : 'var(--radius-lg)'};
      }
      
      .message.user .message-content {
        background-color: var(--accent-color);
        color: white;
      }
      
      .message-time {
        font-size: 12px;
        color: var(--secondary-text);
        margin-top: var(--spacing-xs);
      }
      
      .message.user .message-time {
        color: rgba(255, 255, 255, 0.8);
      }
      
      .message-input-container {
        padding: var(--spacing-md);
        border-top: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }
      
      .message-input {
        width: 100%;
        min-height: 60px;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        background-color: var(--primary-bg);
        color: var(--primary-text);
        font-family: var(--font-family);
        font-size: 15px;
        resize: none;
      }
      
      .message-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
      }
      
      .message-actions button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background-color: var(--tertiary-bg);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .message-actions .send-button {
        background-color: var(--accent-color);
      }
      
      .message-actions .send-button .icon {
        fill: white;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add event listeners
  const messageInput = container.querySelector('.message-input');
  const sendButton = container.querySelector('.send-button');
  const voiceButton = container.querySelector('.voice-button');
  
  sendButton.addEventListener('click', () => {
    if (messageInput.value.trim()) {
      sendMessage(messageInput.value, container);
      messageInput.value = '';
    }
  });
  
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageInput.value.trim()) {
        sendMessage(messageInput.value, container);
        messageInput.value = '';
      }
    }
  });
  
  voiceButton.addEventListener('click', () => {
    toggleVoiceInput(voiceButton);
  });
}

// Send a message in the conversation
function sendMessage(text, container) {
  const messageList = container.querySelector('.message-list');
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Add user message
  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.innerHTML = `
    <div class="message-content">
      <div class="message-text">${text}</div>
      <div class="message-time">${timeString}</div>
    </div>
    <div class="message-avatar">U</div>
  `;
  messageList.appendChild(userMessage);
  
  // Scroll to bottom
  messageList.scrollTop = messageList.scrollHeight;
  
  // Simulate AI response (in a real app, this would call the backend)
  setTimeout(() => {
    const aiMessage = document.createElement('div');
    aiMessage.className = 'message ai';
    aiMessage.innerHTML = `
      <div class="message-avatar">M</div>
      <div class="message-content">
        <div class="message-text">I'm processing your request: "${text}"</div>
        <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    `;
    messageList.appendChild(aiMessage);
    
    // Scroll to bottom
    messageList.scrollTop = messageList.scrollHeight;
  }, 1000);
}

// Toggle voice input
function toggleVoiceInput(button) {
  const isActive = button.classList.toggle('active');
  
  if (isActive) {
    button.style.backgroundColor = 'var(--error-color)';
    // Start voice recording (would use Web Speech API in a real implementation)
    console.log('Voice recording started');
  } else {
    button.style.backgroundColor = '';
    // Stop voice recording
    console.log('Voice recording stopped');
  }
}

function loadProjectView(container, projectType) {
  console.log(`Loading project view: ${projectType}`);
  
  // Create project view
  container.innerHTML = `
    <div class="project-view">
      <h1>${projectType}</h1>
      
      <div class="project-container">
        ${projectType === 'New Project' ? createNewProjectForm() : createProjectList(projectType)}
      </div>
    </div>
  `;
  
  // Add event listeners for the new project form if applicable
  if (projectType === 'New Project') {
    const form = container.querySelector('.new-project-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const projectName = form.querySelector('#project-name').value;
      const projectType = form.querySelector('#project-type').value;
      createProject(projectName, projectType);
    });
  }
}

function createNewProjectForm() {
  return `
    <div class="card">
      <h2>Create New Project</h2>
      <form class="new-project-form">
        <div class="form-group">
          <label for="project-name">Project Name</label>
          <input type="text" id="project-name" required>
        </div>
        
        <div class="form-group">
          <label for="project-type">Project Type</label>
          <select id="project-type">
            <option value="web">Web Development</option>
            <option value="data">Data Analysis</option>
            <option value="research">Research</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="project-description">Description (Optional)</label>
          <textarea id="project-description"></textarea>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="primary-button">Create Project</button>
        </div>
      </form>
    </div>
  `;
}

function createProjectList(projectType) {
  // This would typically fetch from a database or local storage
  const projects = [
    { name: 'Project 1', description: 'Description of project 1', lastModified: '2 days ago' },
    { name: 'Project 2', description: 'Description of project 2', lastModified: '1 week ago' },
    { name: 'Project 3', description: 'Description of project 3', lastModified: '2 weeks ago' }
  ];
  
  let projectsHTML = '';
  
  projects.forEach(project => {
    projectsHTML += `
      <div class="project-item card">
        <div class="project-header">
          <h3>${project.name}</h3>
          <div class="project-actions">
            <button class="icon-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
            <button class="icon-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
        <p>${project.description}</p>
        <div class="project-footer">
          <span>Last modified: ${project.lastModified}</span>
          <button class="secondary-button">Open</button>
        </div>
      </div>
    `;
  });
  
  return `
    <div class="projects-list">
      ${projectsHTML}
    </div>
  `;
}

function createProject(name, type) {
  console.log(`Creating new project: ${name} (${type})`);
  // This would typically save to a database or local storage
  
  // Navigate to the appropriate project type view
  switch(type) {
    case 'web':
      navigateToView('Web Development');
      break;
    case 'data':
      navigateToView('Data Analysis');
      break;
    default:
      navigateToView('Dashboard');
  }
}

function loadCodeEditorView(container) {
  console.log('Loading code editor view');
  
  // Create code editor view
  container.innerHTML = `
    <div class="code-editor-view">
      <h1>Code Editor</h1>
      
      <div class="editor-container">
        <div class="editor-toolbar">
          <select class="language-selector">
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          
          <div class="toolbar-actions">
            <button class="toolbar-button run-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Run
            </button>
            <button class="toolbar-button format-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>
              </svg>
              Format
            </button>
            <button class="toolbar-button save-button">
              <svg class="icon" viewBox="0 0 24 24">
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
              </svg>
              Save
            </button>
          </div>
        </div>
        
        <div class="editor-content">
          <div class="line-numbers">1</div>
          <textarea class="code-area">import pandas as pd
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('sales_data.csv')

# Display basic information
print(df.info())
print(df.describe())

# Create visualization
plt.figure(figsize=(10, 6))
plt.bar(df['Month'], df['Sales'])
plt.title('Monthly Sales')
plt.xlabel('Month')
plt.ylabel('Sales ($)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()</textarea>
        </div>
        
        <div class="output-panel">
          <div class="output-header">
            <h3>Output</h3>
            <button class="clear-output-button">Clear</button>
          </div>
          <div class="output-content"></div>
        </div>
      </div>
    </div>
  `;
  
  // Add styles if not already in the document
  if (!document.querySelector('style#code-editor-styles')) {
    const style = document.createElement('style');
    style.id = 'code-editor-styles';
    style.textContent = `
      .editor-container {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 150px);
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--border-color);
      }
      
      .editor-toolbar {
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-sm) var(--spacing-md);
        background-color: var(--secondary-bg);
        border-bottom: 1px solid var(--border-color);
      }
      
      .language-selector {
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        background-color: var(--primary-bg);
        color: var(--primary-text);
      }
      
      .toolbar-actions {
        display: flex;
        gap: var(--spacing-sm);
      }
      
      .toolbar-button {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        background-color: var(--primary-bg);
        color: var(--primary-text);
        cursor: pointer;
      }
      
      .toolbar-button:hover {
        background-color: var(--tertiary-bg);
      }
      
      .run-button {
        background-color: var(--accent-color);
        color: white;
        border: none;
      }
      
      .run-button:hover {
        background-color: var(--accent-color);
        opacity: 0.9;
      }
      
      .run-button .icon {
        fill: white;
      }
      
      .editor-content {
        display: flex;
        flex: 1;
        overflow: hidden;
        background-color: var(--primary-bg);
        font-family: var(--font-mono);
      }
      
      .line-numbers {
        padding: var(--spacing-md) var(--spacing-sm);
        background-color: var(--secondary-bg);
        color: var(--secondary-text);
        text-align: right;
        user-select: none;
      }
      
      .code-area {
        flex: 1;
        padding: var(--spacing-md);
        border: none;
        resize: none;
        background-color: var(--primary-bg);
        color: var(--primary-text);
        font-family: var(--font-mono);
        font-size: 14px;
        line-height: 1.5;
        tab-size: 4;
      }
      
      .output-panel {
        height: 200px;
        border-top: 1px solid var(--border-color);
        background-color: var(--secondary-bg);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .output-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-xs) var(--spacing-md);
        border-bottom: 1px solid var(--border-color);
      }
      
      .output-header h3 {
        font-size: 14px;
        margin: 0;
      }
      
      .clear-output-button {
        background: none;
        border: none;
        color: var(--secondary-text);
        cursor: pointer;
        font-size: 12px;
      }
      
      .output-content {
        flex: 1;
        padding: var(--spacing-md);
        overflow-y: auto;
        font-family: var(--font-mono);
        font-size: 13px;
        white-space: pre-wrap;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Set up line numbers
  const codeArea = container.querySelector('.code-area');
  const lineNumbers = container.querySelector('.line-numbers');
  
  function updateLineNumbers() {
    const lines = codeArea.value.split('\n').length;
    let lineNumbersHTML = '';
    for (let i = 1; i <= lines; i++) {
      lineNumbersHTML += i + '<br>';
    }
    lineNumbers.innerHTML = lineNumbersHTML;
  }
  
  updateLineNumbers();
  
  codeArea.addEventListener('input', updateLineNumbers);
  codeArea.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeArea.scrollTop;
  });
  
  // Set up run button
  const runButton = container.querySelector('.run-button');
  const outputContent = container.querySelector('.output-content');
  
  runButton.addEventListener('click', () => {
    const code = codeArea.value;
    const language = container.querySelector('.language-selector').value;
    
    // In a real app, this would send the code to a backend for execution
    // For now, we'll just simulate output
    outputContent.innerHTML = `Running ${language} code...\n\n`;
    
    setTimeout(() => {
      if (language === 'python') {
        outputContent.innerHTML += `<class 'pandas.core.frame.DataFrame'>\nRangeIndex: 12 entries, 0 to 11\nData columns (total 2 columns):\n #   Column  Non-Null Count  Dtype\n---  ------  --------------  -----\n 0   Month   12 non-null     object\n 1   Sales   12 non-null     int64\ndtypes: int64(1), object(1)\nmemory usage: 320.0+ bytes\n\n       Sales\ncount  12.000000\nmean   8583.333333\nstd    3929.747661\nmin    3120.000000\n25%    5095.000000\n50%    8940.000000\n75%   11927.500000\nmax   14500.000000\n\nFigure created. Showing plot...\n`;
      } else if (language === 'javascript') {
        outputContent.innerHTML += `Console output:\nLoaded data successfully\nCalculating statistics...\nMean: 8583.33\nMedian: 8940\nStandard Deviation: 3929.75\n\nCreating visualization...\nChart rendered successfully\n`;
      } else {
        outputContent.innerHTML += `Execution complete for ${language}\n`;
      }
    }, 1000);
  });
  
  // Set up clear output button
  const clearOutputButton = container.querySelector('.clear-output-button');
  
  clearOutputButton.addEventListener('click', () => {
    outputContent.innerHTML = '';
  });
  
  // Set up format button
  const formatButton = container.querySelector('.format-button');
  
  formatButton.addEventListener('click', () => {
    // In a real app, this would use a code formatter
    // For now, we'll just show a message
    outputContent.innerHTML += 'Formatting code...\nCode formatted successfully\n';
  });
  
  // Set up save button
  const saveButton = container.querySelector('.save-button');
  
  saveButton.addEventListener('click', () => {
    // In a real app, this would save the file
    // For now, we'll just show a message
    outputContent.innerHTML += 'Saving code...\nCode saved successfully\n';
  });
}

function loadNeuralNetworkView(container) {
  console.log('Loading neural network view');
  
  // Create neural network view
  container.innerHTML = `
    <div class="neural-network-view">
      <h1>Neural Network</h1>
      
      <div class="neural-network-container">
        <div class="card">
          <h2>Neural Network Status</h2>
          <div class="status-items">
            <div class="status-item">
              <div class="status-label">Model Status</div>
              <div class="status-value">
                <span class="status-indicator online"></span>
                Active
              </div>
            </div>
            <div class="status-item">
              <div class="status-label">Last Training</div>
              <div class="status-value">Yesterday, 3:45 PM</div>
            </div>
            <div class="status-item">
              <div class="status-label">Accuracy</div>
              <div class="status-value">94.3%</div>
            </div>
            <div class="status-item">
              <div class="status-label">Model Version</div>
              <div class="status-value">v2.3.1</div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2>User Preferences</h2>
          <div class="preferences-form">
            <div class="form-group">
              <label for="response-length">Response Length</label>
              <select id="response-length">
                <option value="concise">Concise</option>
                <option value="balanced" selected>Balanced</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="formality">Formality</label>
              <select id="formality">
                <option value="casual">Casual</option>
                <option value="neutral" selected>Neutral</option>
                <option value="formal">Formal</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="technical-level">Technical Level</label>
              <select id="technical-level">
                <option value="beginner">Beginner</option>
                <option value="intermediate" selected>Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Preferred Topics</label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" checked> Technology
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" checked> Science
                </label>
                <label class="checkbox-label">
                  <input type="checkbox"> Arts
                </label>
                <label class="checkbox-label">
                  <input type="checkbox"> Business
                </label>
              </div>
            </div>
            
            <button class="primary-button">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add event listeners
  const saveButton = container.querySelector('.primary-button');
  
  saveButton.addEventListener('click', () => {
    console.log('Saving neural network preferences');
    // In a real app, this would save the preferences
    
    // Show a success message
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'Preferences saved successfully';
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.right = '20px';
    message.style.padding = '10px 20px';
    message.style.backgroundColor = 'var(--success-color)';
    message.style.color = 'white';
    message.style.borderRadius = 'var(--radius-md)';
    message.style.boxShadow = '0 2px 8px var(--shadow-color)';
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.opacity = '0';
      message.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        document.body.removeChild(message);
      }, 500);
    }, 3000);
  });
}

function loadSpeechSynthesisView(container) {
  console.log('Loading speech synthesis view');
  
  // Create speech synthesis view
  container.innerHTML = `
    <div class="speech-synthesis-view">
      <h1>Speech Synthesis</h1>
      
      <div class="speech-synthesis-container">
        <div class="card">
          <h2>Text to Speech</h2>
          <div class="tts-form">
            <div class="form-group">
              <label for="tts-text">Text to Speak</label>
              <textarea id="tts-text" rows="5" placeholder="Enter text to be spoken...">Welcome to Mack AI. I am your intelligent assistant, designed to help you with a wide range of tasks.</textarea>
            </div>
            
            <div class="form-group">
              <label for="voice-select">Voice</label>
              <select id="voice-select">
                <option value="default">Default</option>
                <option value="male">Male</option>
                <option value="female" selected>Female</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="rate-slider">Rate</label>
              <div class="slider-container">
                <input type="range" id="rate-slider" min="0.5" max="2" step="0.1" value="1">
                <span class="slider-value">1.0</span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="pitch-slider">Pitch</label>
              <div class="slider-container">
                <input type="range" id="pitch-slider" min="0.5" max="2" step="0.1" value="1">
                <span class="slider-value">1.0</span>
              </div>
            </div>
            
            <div class="tts-actions">
              <button class="primary-button play-button">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Speak
              </button>
              <button class="secondary-button stop-button" disabled>
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M6 6h12v12H6z"/>
                </svg>
                Stop
              </button>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2>Speech Recognition</h2>
          <div class="speech-recognition-container">
            <div class="microphone-container">
              <button class="microphone-button">
                <svg class="icon" viewBox="0 0 24 24">
                  <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.42 2.72 6.23 6 6.72V22h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
              </button>
              <div class="microphone-status">Click to start recording</div>
            </div>
            
            <div class="recognition-result">
              <h3>Recognized Text</h3>
              <div class="result-text">Recognition results will appear here...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add styles if not already in the document
  if (!document.querySelector('style#speech-synthesis-styles')) {
    const style = document.createElement('style');
    style.id = 'speech-synthesis-styles';
    style.textContent = `
      .speech-synthesis-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: var(--spacing-lg);
      }
      
      .tts-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
      }
      
      .form-group label {
        font-weight: 500;
      }
      
      .form-group textarea,
      .form-group select {
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        background-color: var(--primary-bg);
        color: var(--primary-text);
        font-family: var(--font-family);
      }
      
      .slider-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }
      
      .slider-container input {
        flex: 1;
      }
      
      .tts-actions {
        display: flex;
        gap: var(--spacing-md);
      }
      
      .primary-button,
      .secondary-button {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        font-weight: 500;
        cursor: pointer;
      }
      
      .primary-button {
        background-color: var(--accent-color);
        color: white;
        border: none;
      }
      
      .secondary-button {
        background-color: var(--tertiary-bg);
        color: var(--primary-text);
        border: 1px solid var(--border-color);
      }
      
      .primary-button:disabled,
      .secondary-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      .primary-button .icon {
        fill: white;
      }
      
      .secondary-button .icon {
        fill: var(--primary-text);
      }
      
      .microphone-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
      }
      
      .microphone-button {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: var(--accent-color);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      
      .microphone-button .icon {
        width: 40px;
        height: 40px;
        fill: white;
      }
      
      .microphone-status {
        font-size: 14px;
        color: var(--secondary-text);
      }
      
      .recognition-result {
        background-color: var(--tertiary-bg);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
      }
      
      .recognition-result h3 {
        margin-top: 0;
        margin-bottom: var(--spacing-sm);
        font-size: 16px;
      }
      
      .result-text {
        font-family: var(--font-family);
        min-height: 100px;
      }
      
      .checkbox-group {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-sm);
      }
      
      .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-weight: normal;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add event listeners
  const rateSlider = container.querySelector('#rate-slider');
  const pitchSlider = container.querySelector('#pitch-slider');
  const rateValue = container.querySelector('#rate-slider + .slider-value');
  const pitchValue = container.querySelector('#pitch-slider + .slider-value');
  
  rateSlider.addEventListener('input', () => {
    rateValue.textContent = parseFloat(rateSlider.value).toFixed(1);
  });
  
  pitchSlider.addEventListener('input', () => {
    pitchValue.textContent = parseFloat(pitchSlider.value).toFixed(1);
  });
  
  const playButton = container.querySelector('.play-button');
  const stopButton = container.querySelector('.stop-button');
  const ttsText = container.querySelector('#tts-text');
  
  playButton.addEventListener('click', () => {
    if (!ttsText.value.trim()) return;
    
    playButton.disabled = true;
    stopButton.disabled = false;
    
    // In a real app, this would use the Web Speech API
    console.log('Speaking:', ttsText.value);
    console.log('Voice:', container.querySelector('#voice-select').value);
    console.log('Rate:', rateSlider.value);
    console.log('Pitch:', pitchSlider.value);
    
    // Simulate speech duration
    setTimeout(() => {
      playButton.disabled = false;
      stopButton.disabled = true;
    }, 5000);
  });
  
  stopButton.addEventListener('click', () => {
    playButton.disabled = false;
    stopButton.disabled = true;
    
    // In a real app, this would stop the Web Speech API
    console.log('Speech stopped');
  });
  
  const microphoneButton = container.querySelector('.microphone-button');
  const microphoneStatus = container.querySelector('.microphone-status');
  const resultText = container.querySelector('.result-text');
  
  microphoneButton.addEventListener('click', () => {
    const isRecording = microphoneButton.classList.toggle('recording');
    
    if (isRecording) {
      microphoneButton.style.backgroundColor = 'var(--error-color)';
      microphoneStatus.textContent = 'Listening...';
      
      // In a real app, this would use the Web Speech API
      console.log('Recording started');
      
      // Simulate recording duration
      setTimeout(() => {
        microphoneButton.classList.remove('recording');
        microphoneButton.style.backgroundColor = '';
        microphoneStatus.textContent = 'Click to start recording';
        
        // Simulate recognition result
        resultText.textContent = 'This is a simulated speech recognition result. In a real application, this would use the Web Speech API to convert your spoken words to text.';
      }, 3000);
    } else {
      microphoneButton.style.backgroundColor = '';
      microphoneStatus.textContent = 'Click to start recording';
      
      // In a real app, this would stop the Web Speech API
      console.log('Recording stopped');
    }
  });
}
