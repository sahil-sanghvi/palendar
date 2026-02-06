# Palendar 📅

> A collaborative group calendar application designed to simplify scheduling and event planning among friends, colleagues, and teams.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)

**[View Figma Design →](https://www.figma.com/design/CE1B0pPyrbsK7ngD9Tvy8Y/Palendar)**

---

## 📖 About the Project

Palendar was developed as part of a Human-Computer Interaction (HCI) course, following a comprehensive design process from initial research through to high-fidelity prototyping. The project demonstrates the application of user-centered design principles to solve real-world scheduling and coordination challenges.

### 🎯 Problem Statement

Coordinating schedules among groups of people is often frustrating and time-consuming. Existing calendar solutions lack intuitive group collaboration features, making it difficult to:
- Find common availability across multiple people
- Coordinate events for different social/professional groups
- Keep track of group-specific activities and commitments
- Communicate about scheduling within the context of events

### 💡 Solution

Palendar is a mobile-first calendar application that streamlines group coordination through:
- **Group-centric organization** - Create separate calendars for different social circles
- **Availability sharing** - Easily share and visualize when group members are free
- **Integrated communication** - Chat directly within the app about events and scheduling
- **Event management** - Plan, propose, and confirm events collaboratively

---

## 🎨 Design Process

This project followed a structured HCI methodology:

### 1. **Research Phase**
- User interviews and surveys to understand pain points
- Competitive analysis of existing calendar applications
- Persona development and user journey mapping

### 2. **Ideation & Conceptualization**
- Brainstorming sessions for feature ideas
- Low-fidelity sketches and wireframes
- Concept validation through user feedback

### 3. **Prototyping**
- Mid-fidelity interactive prototypes in Figma
- High-fidelity mockups with complete visual design
- Comprehensive design system development

### 4. **Implementation**
- Development of functional prototype using React and TypeScript
- Implementation of core features and interactions
- Usability testing and iterative refinement

### 5. **Evaluation**
- Heuristic evaluation against Nielsen's usability principles
- User testing sessions with target audience
- Iteration based on feedback and observations

---

## ✨ Key Features

### 📱 Personal Calendar
- View and manage your personal schedule
- Add, edit, and delete events
- Color-coded event categories
- Monthly and weekly views

### 👥 Group Management
- Create multiple groups (friends, work, study groups, etc.)
- Add members to groups
- Manage group settings and permissions
- Leave or delete groups

### 📊 Group Calendar
- Shared calendar view for each group
- See all group members' availability
- Propose events and check conflicts
- Vote on potential time slots

### 💬 In-App Chat
- Message friends and group members
- Discuss event planning
- Share availability updates
- Real-time messaging interface

### ⏰ Availability Tracking
- Set your available time slots
- View when group members are free
- Find optimal meeting times automatically
- Update availability quickly

### 🎉 Event Planning
- Create and propose events
- Track RSVPs and attendees
- Add event details (location, time, description)
- Send event reminders

---

## 🛠️ Technology Stack

**Frontend Framework:**
- React 18.3.1
- TypeScript
- Vite (build tool)

**UI Components:**
- Radix UI (accessible component primitives)
- Tailwind CSS (styling)
- Lucide React (icons)
- Motion (animations)

**State Management:**
- React hooks (useState, useEffect)
- Local state management

**Date Handling:**
- react-day-picker

**Additional Libraries:**
- react-hook-form (form management)
- recharts (data visualization)
- sonner (toast notifications)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/palendar.git
   cd palendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

---

## 📱 User Interface

### Main Views

1. **Login** - Secure user authentication
2. **Home** - Dashboard with quick access to all features
3. **Personal Calendar** - Individual schedule management
4. **Groups** - List of all groups and group management
5. **Group Calendar** - Shared group scheduling
6. **Availability** - Set and view available time slots
7. **Events** - Upcoming and planned events
8. **Chat** - Messaging interface
9. **Profile** - User settings and preferences

---

## 🎯 Design Principles

### Usability Heuristics Applied

1. **Visibility of System Status** - Clear feedback for all actions
2. **Match Between System and Real World** - Familiar calendar metaphors
3. **User Control and Freedom** - Easy undo/cancel options
4. **Consistency and Standards** - Uniform design patterns
5. **Error Prevention** - Validation and confirmation dialogs
6. **Recognition Rather Than Recall** - Visual cues and labels
7. **Flexibility and Efficiency** - Shortcuts for power users
8. **Aesthetic and Minimalist Design** - Clean, focused interface
9. **Help Users Recognize, Diagnose, and Recover** - Clear error messages
10. **Help and Documentation** - Contextual help throughout

### Accessibility Features

- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Touch-friendly interface elements
- Responsive design for various screen sizes

---

## 📊 Project Deliverables

### Design Artifacts
- User research findings and personas
- User journey maps and task flows
- Low-fidelity wireframes
- High-fidelity mockups in Figma
- Interactive prototype
- Design system documentation

### Development Artifacts
- Functional React application
- Component library
- TypeScript type definitions
- Responsive layouts
- Animation and interaction patterns

### Evaluation Artifacts
- Usability testing reports
- Heuristic evaluation results
- User feedback analysis
- Iteration documentation

---

## 🔮 Future Enhancements

- **Calendar Integration** - Sync with Google Calendar, Outlook, etc.
- **Smart Scheduling** - AI-powered meeting time suggestions
- **Notifications** - Push notifications for events and messages
- **Recurring Events** - Support for repeating events
- **Event Templates** - Predefined event types
- **Export/Import** - Calendar data portability
- **Mobile App** - Native iOS and Android applications
- **Advanced Analytics** - Group activity insights

---

## 👥 Team & Acknowledgments

**Course:** SENG 310 - Human-Computer Interaction  
**Institution:** University of Victoria  
**Semester:** [Your Semester/Year]

**Team Members:**
- Sahil Sanghvi - [Your Role]
- [Other Team Members if applicable]

**Special Thanks:**
- Course instructors and TAs
- User testing participants
- Peer reviewers

---

## 📄 License

This project was developed for educational purposes as part of a university course.

---

## 📞 Contact

**Sahil Sanghvi**
- GitHub: [@sahil-sanghvi](https://github.com/sahil-sanghvi)
- LinkedIn: [Sahil Mit Sanghvi](https://linkedin.com/in/sahil-mit-sanghvi)
- Email: ssanghvi@uvic.ca

---

## 📚 Documentation

For detailed design documentation and process details, see:
- [Figma Design File](https://www.figma.com/design/CE1B0pPyrbsK7ngD9Tvy8Y/Palendar)
- Design system guidelines (in `/src/guidelines/`)
- Component documentation (in `/src/components/`)

---

**Built with ❤️ using Human-Centered Design principles**
