# Mack AI macOS Application - Enhanced GUI Design

## Design Philosophy

The Mack AI macOS application will follow a design philosophy that balances:

1. **Native macOS Feel**: Adhering to Apple's Human Interface Guidelines while maintaining Mack AI's identity
2. **Intuitive Interactions**: Creating workflows that feel natural to macOS users
3. **Visual Sophistication**: Employing subtle animations, proper spacing, and thoughtful use of color
4. **Accessibility**: Ensuring the application is usable by everyone
5. **Performance**: Maintaining smooth animations and responsive interactions

## Color Scheme

### Light Mode
- **Primary Background**: #FFFFFF
- **Secondary Background**: #F5F5F7
- **Tertiary Background**: #E9E9EB
- **Primary Text**: #1D1D1F
- **Secondary Text**: #6E6E73
- **Accent Color**: #2563EB (Mack AI Blue)
- **Success Color**: #34C759
- **Warning Color**: #FF9500
- **Error Color**: #FF3B30

### Dark Mode
- **Primary Background**: #1C1C1E
- **Secondary Background**: #2C2C2E
- **Tertiary Background**: #3A3A3C
- **Primary Text**: #FFFFFF
- **Secondary Text**: #98989D
- **Accent Color**: #3B82F6 (Mack AI Blue - Dark Mode)
- **Success Color**: #30D158
- **Warning Color**: #FF9F0A
- **Error Color**: #FF453A

### Vibrancy Effects
- Sidebar: Material.sidebar
- Toolbar: Material.headerView
- Sheets: Material.sheet

## Typography

- **Primary Font**: SF Pro
- **Monospace Font**: SF Mono (for code)
- **Size Scale**:
  - Large Title: 34pt
  - Title 1: 28pt
  - Title 2: 22pt
  - Title 3: 20pt
  - Headline: 17pt
  - Body: 15pt
  - Callout: 14pt
  - Subhead: 13pt
  - Footnote: 12pt
  - Caption 1: 11pt
  - Caption 2: 10pt

## Layout Structure

### Main Window
- **Dimensions**: Default 1200×800px, resizable with minimum 800×600px
- **Window Chrome**: Custom titlebar with integrated toolbar
- **Sidebar**: Collapsible, 240px default width
- **Content Area**: Adaptive layout with responsive components

### Window Components
1. **Titlebar**
   - Traffic light controls (close, minimize, zoom)
   - App title/current view title
   - Search field
   - User profile button
   - Settings button

2. **Sidebar**
   - Mack AI logo
   - Navigation sections
   - Project list
   - Recent conversations
   - Collapse/expand control

3. **Content Area**
   - Context-dependent based on selected view
   - Maintains consistent padding (20px)
   - Responsive grid layout

4. **Status Bar**
   - Connection status
   - Sync status
   - Offline indicator
   - Performance metrics (when relevant)

## Component Design

### Navigation
- **Sidebar Navigation**
  - Selected state: Accent color background, white text
  - Hover state: Light background tint
  - Icons: SF Symbols, consistent 16pt size
  - Section headers: All caps, 11pt
  - Disclosure triangles for expandable sections

- **Tab Bar** (when applicable)
  - macOS-native tab style
  - Icon + text for each tab
  - Overflow menu for many tabs

### Buttons
- **Primary Button**
  - Rounded rectangle (8px radius)
  - Accent color fill
  - White text
  - Hover: Slight darkening
  - Press: Scale down slightly (98%)

- **Secondary Button**
  - Rounded rectangle (8px radius)
  - Stroke outline, no fill
  - Accent color text
  - Hover: Light background tint
  - Press: Scale down slightly (98%)

- **Icon Button**
  - Circular or pill-shaped
  - Transparent background
  - Hover: Light background tint
  - Press: Scale down slightly (98%)

### Cards
- **Standard Card**
  - Rounded rectangle (12px radius)
  - Subtle shadow (y: 2px, blur: 8px, opacity: 8%)
  - White/dark background based on theme
  - Hover: Slight elevation increase
  - Selection: Accent color border

- **Project Card**
  - Rounded rectangle (12px radius)
  - Subtle shadow
  - Preview thumbnail
  - Title, description, metadata
  - Progress indicator when applicable
  - Action buttons on hover

### Inputs
- **Text Field**
  - Rounded rectangle (6px radius)
  - Light border
  - Focus: Accent color border
  - Error: Error color border with message
  - Clear button on non-empty state

- **Search Field**
  - Rounded rectangle (6px radius)
  - Search icon prefix
  - Clear button on non-empty state
  - Results popover with keyboard navigation

- **Voice Input**
  - Circular button with microphone icon
  - Pulse animation when recording
  - Waveform visualization during speech

### Conversation Interface
- **Message Bubbles**
  - User: Accent color, right-aligned
  - AI: Secondary background, left-aligned
  - Rounded corners (16px radius)
  - Timestamp and status indicators
  - Support for rich content (code, images, etc.)

- **Input Area**
  - Multi-line text field
  - Attachment button
  - Voice input button
  - Send button
  - Typing indicators

### Code Editor
- **Editor Area**
  - Syntax highlighting
  - Line numbers
  - Current line highlight
  - Minimap navigation
  - Tab/space visualization option

- **Toolbar**
  - Language selector
  - Run button
  - Save button
  - Format button
  - Settings dropdown

### Notifications
- **In-App Notifications**
  - Slide in from top-right
  - Auto-dismiss after timeout
  - Action buttons when applicable
  - Stacking for multiple notifications

- **System Notifications**
  - Native macOS notifications
  - App icon
  - Title and message
  - Action buttons when applicable

## Animations and Transitions

### Navigation Transitions
- **View Changes**: Cross-fade with slight movement (300ms)
- **Sidebar Collapse/Expand**: Smooth width animation (250ms)
- **Modal Presentation**: Scale up with fade (350ms, spring curve)

### Micro-interactions
- **Button Hover**: Subtle scale (102%) and background change
- **Button Press**: Quick scale down (98%)
- **Toggle States**: Smooth position transitions with bounce
- **List Reordering**: Physical dragging behavior with drop preview

### Loading States
- **Progress Indicators**: Native-style circular or bar indicators
- **Skeleton Screens**: Content placeholder animations
- **Success States**: Checkmark animation with success color

## Touch Bar Integration

### Global Controls
- **Quick Actions**: New conversation, new project, search
- **Mode Switching**: Switch between conversation, coding, settings
- **Voice Input**: Direct voice input button

### Context-Specific Controls
- **Conversation**: Message formatting, attachments, templates
- **Code Editor**: Run, debug, format, language selection
- **Projects**: Create, open recent, templates

## Menu Bar Integration

### Application Menu
- Standard About, Preferences, Services, Hide, Quit items
- Recent items submenu

### File Menu
- New Conversation, New Project, Open, Save, Export options
- iCloud sync options

### Edit Menu
- Standard editing commands
- Find and Replace
- Speech submenu for voice input/output

### View Menu
- Sidebar toggle
- Theme selection
- Text size adjustment
- Show/hide components

### Window Menu
- Standard window management
- Tab management
- Split view options

### Help Menu
- Documentation
- Keyboard shortcuts
- Send Feedback
- Check for Updates

## Dock Integration

### Dock Icon
- Mack AI logo with macOS-appropriate styling
- Badge for notifications or status
- Progress indicator for long-running tasks

### Dock Menu
- New Conversation
- New Project
- Recent Items
- Quick Actions

## Keyboard Shortcuts

### Global Shortcuts
- **⌘N**: New conversation
- **⇧⌘N**: New project
- **⌘O**: Open
- **⌘S**: Save
- **⌘F**: Find
- **⌘,**: Preferences
- **⌘M**: Minimize
- **⌘W**: Close window
- **⌘Q**: Quit

### Navigation Shortcuts
- **⌘1-9**: Switch between sidebar items
- **⌘[**: Back
- **⌘]**: Forward
- **⌘L**: Focus search field

### Conversation Shortcuts
- **⌘↩**: Send message
- **⌥⌘V**: Start voice input
- **⌘⌫**: Clear conversation

### Code Editor Shortcuts
- **⌘R**: Run code
- **⇧⌘F**: Format code
- **⌘B**: Toggle sidebar
- **⌘/**: Toggle comment

## Accessibility Considerations

### VoiceOver Support
- All controls properly labeled
- Logical navigation order
- Custom rotor actions for specialized interfaces

### Keyboard Navigation
- Full keyboard access to all features
- Visible focus indicators
- Logical tab order

### Visual Accommodations
- Support for Dynamic Type
- High contrast mode
- Reduced transparency option
- Reduced motion option

## Mockups

### Main Window - Light Mode
```
┌────────────────────────────────────────────────────────────────────────┐
│ ● ○ ○  Mack AI                                      🔍  👤  ⚙️          │
├────────────────────────────┬───────────────────────────────────────────┤
│                            │                                           │
│  MACK AI                   │  Dashboard                                │
│                            │                                           │
│  • Dashboard               │  ┌─────────────┐  ┌─────────────┐         │
│  • Conversations           │  │ Recent      │  │ System      │         │
│    ├ General               │  │ Activity    │  │ Status      │         │
│    ├ Code                  │  │             │  │             │         │
│    └ Research              │  │             │  │             │         │
│                            │  └─────────────┘  └─────────────┘         │
│  • Projects                │                                           │
│    ├ Web Development       │  ┌─────────────────────────────────────┐  │
│    ├ Data Analysis         │  │ Recent Projects                     │  │
│    └ + New Project         │  │ ┌─────────┐  ┌─────────┐  ┌────────┐│  │
│                            │  │ │Project 1│  │Project 2│  │Project 3││  │
│  • Tools                   │  │ │         │  │         │  │        ││  │
│    ├ Code Editor           │  │ │         │  │         │  │        ││  │
│    ├ Neural Network        │  │ └─────────┘  └─────────┘  └────────┘│  │
│    └ Speech Synthesis      │  └─────────────────────────────────────┘  │
│                            │                                           │
│                            │                                           │
│                            │                                           │
│                            │                                           │
│                            │                                           │
│                            │                                           │
├────────────────────────────┴───────────────────────────────────────────┤
│ ● Online  |  Last synced: 2 minutes ago                                │
└────────────────────────────────────────────────────────────────────────┘
```

### Conversation View - Dark Mode
```
┌────────────────────────────────────────────────────────────────────────┐
│ ● ○ ○  Conversation                                 🔍  👤  ⚙️          │
├────────────────────────────┬───────────────────────────────────────────┤
│                            │                                           │
│  MACK AI                   │  ┌─────────────────────────────────────┐  │
│                            │  │ Mack AI • 10:42 AM                  │  │
│  • Dashboard               │  │ Hello! How can I help you today?    │  │
│  • Conversations           │  │                                     │  │
│    ├ General               │  └─────────────────────────────────────┘  │
│    ├ Code                  │                                           │
│    └ Research              │  ┌─────────────────────────────────────┐  │
│                            │  │ You • 10:43 AM                      │  │
│  • Projects                │  │ Can you help me analyze this        │  │
│    ├ Web Development       │  │ dataset and create visualizations?  │  │
│    ├ Data Analysis         │  │                                     │  │
│    └ + New Project         │  └─────────────────────────────────────┘  │
│                            │                                           │
│  • Tools                   │  ┌─────────────────────────────────────┐  │
│    ├ Code Editor           │  │ Mack AI • 10:43 AM                  │  │
│    ├ Neural Network        │  │ I'd be happy to help you analyze    │  │
│    └ Speech Synthesis      │  │ the dataset and create              │  │
│                            │  │ visualizations. Could you please    │  │
│                            │  │ upload the dataset or provide more  │  │
│                            │  │ details about what you're looking   │  │
│                            │  │ for?                                │  │
│                            │  │                                     │  │
│                            │  └─────────────────────────────────────┘  │
│                            │                                           │
├────────────────────────────┴───────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────┐ 📎 🎤 ➤           │
│ │ I have a CSV file with sales data...             │                   │
│ └──────────────────────────────────────────────────┘                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Code Editor - Dark Mode
```
┌────────────────────────────────────────────────────────────────────────┐
│ ● ○ ○  Code Editor                                 🔍  👤  ⚙️          │
├────────────────────────────┬───────────────────────────────────────────┤
│                            │  Python ▾  |  Run  |  Format  |  Save     │
│  MACK AI                   │  ┌─────────────────────────────────────┐  │
│                            │  │1│import pandas as pd                │  │
│  • Dashboard               │  │2│import matplotlib.pyplot as plt    │  │
│  • Conversations           │  │3│                                   │  │
│    ├ General               │  │4│# Load the dataset                 │  │
│    ├ Code                  │  │5│df = pd.read_csv('sales_data.csv') │  │
│    └ Research              │  │6│                                   │  │
│                            │  │7│# Display basic information        │  │
│  • Projects                │  │8│print(df.info())                   │  │
│    ├ Web Development       │  │9│print(df.describe())               │  │
│    ├ Data Analysis         │  │10│                                  │  │
│    └ + New Project         │  │11│# Create visualization            │  │
│                            │  │12│plt.figure(figsize=(10, 6))       │  │
│  • Tools                   │  │13│plt.bar(df['Month'], df['Sales']) │  │
│    ├ Code Editor           │  │14│plt.title('Monthly Sales')        │  │
│    ├ Neural Network        │  │15│plt.xlabel('Month')               │  │
│    └ Speech Synthesis      │  │16│plt.ylabel('Sales ($)')           │  │
│                            │  │17│plt.xticks(rotation=45)           │  │
│                            │  │18│plt.tight_layout()                │  │
│                            │  │19│plt.show()                        │  │
│                            │  │20│                                  │  │
│                            │  └─────────────────────────────────────┘  │
│                            │  ┌─────────────────────────────────────┐  │
│                            │  │ Output                              │  │
│                            │  └─────────────────────────────────────┘  │
├────────────────────────────┴───────────────────────────────────────────┤
│ ● Online  |  Python 3.9.6  |  data_analysis.py                         │
└────────────────────────────────────────────────────────────────────────┘
```

## Responsive Behavior

### Window Resizing
- Sidebar collapses to icons-only at narrow widths (<900px)
- Content area adapts with fluid grid system
- Controls maintain minimum touch target size (44×44pt)

### Split View Support
- Optimized layouts for side-by-side use
- Maintains functionality in constrained space

### Full Screen Support
- Proper toolbar hiding/showing behavior
- Content scales appropriately to fill space

## Touch Bar Layout

### Global Layout
```
┌─────────────────────────────────────────────────────────────┐
│ 🏠 Dashboard | 💬 Conversation | 📝 Code | 🔍 Search | 🎤 Voice │
└─────────────────────────────────────────────────────────────┘
```

### Conversation Layout
```
┌─────────────────────────────────────────────────────────────┐
│ 📎 Attach | 📷 Image | 📊 Chart | 📋 Template | 🎤 Voice | ➤ Send │
└─────────────────────────────────────────────────────────────┘
```

### Code Editor Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ▶️ Run | 📄 Format | 💾 Save | 🔍 Find | 🔄 Indent | 📋 Snippet │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Notes

### SF Symbols Usage
- Use SF Symbols for all iconography
- Prefer multicolor symbols where appropriate
- Use consistent weights (preferably regular)
- Consider variable symbols for dynamic states

### Animation Guidelines
- Use CASpringAnimation for natural movement
- Keep durations between 200-350ms
- Respect reduced motion settings
- Use UIViewPropertyAnimator for interruptible animations

### Accessibility Implementation
- Use proper NSAccessibility roles and attributes
- Test with VoiceOver during development
- Implement proper keyboard navigation
- Support dynamic type scaling

## Next Steps

1. Create high-fidelity mockups in Sketch/Figma
2. Develop component prototypes
3. User testing of key interactions
4. Finalize design system
5. Implement in Tauri application
