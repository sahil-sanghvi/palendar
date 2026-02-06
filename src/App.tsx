import { useState } from 'react';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { GroupLanding } from './components/GroupLanding';
import { CreateGroup } from './components/CreateGroup';
import { GroupCalendar } from './components/GroupCalendar';
import { JoinGroup } from './components/JoinGroup';
import { FriendsList } from './components/FriendsList';
import { Chat } from './components/Chat';
import { PersonalCalendar } from './components/PersonalCalendar';
import { Profile } from './components/Profile';
import { PlannedEvents } from './components/PlannedEvents';
import { Availability } from './components/Availability';
import { motion, AnimatePresence } from 'motion/react';

interface Group {
  name: string;
  type: string;
  description: string;
  admin?: string;
  members?: string[];
}

interface Event {
  id: string;
  groupName: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

interface Friend {
  id: string;
  name: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'friend';
  timestamp: Date;
}

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

type PageType = 'home' | 'groups' | 'create-group' | 'group-calendar' | 'join-group' | 'friends' | 'chat' | 'calendar' | 'profile' | 'events' | 'availability';

// Demo messages for each friend
const getInitialDemoMessages = (friendName: string): Message[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const baseMessages: { [key: string]: Message[] } = {
    'Sahil': [
      { id: '1', text: 'Hey! How are you doing?', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'I\'m good! How about you?', sender: 'me', timestamp: new Date(lastMonth.getTime() + 300000) },
      { id: '3', text: 'Doing great! Want to meet up sometime?', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 600000) },
      { id: '4', text: 'Did you see the game last night?', sender: 'friend', timestamp: new Date(twoWeeksAgo) },
      { id: '5', text: 'Yeah! It was intense', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 180000) },
      { id: '6', text: 'Are we still on for the study session?', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '7', text: 'Yep! See you at 3', sender: 'me', timestamp: new Date(lastWeek.getTime() + 120000) },
      { id: '8', text: 'Hey! Are you free for the team meeting tomorrow?', sender: 'friend', timestamp: new Date(threeDaysAgo) },
      { id: '9', text: 'Yeah, I can make it at 10 AM', sender: 'me', timestamp: new Date(threeDaysAgo.getTime() + 300000) },
      { id: '10', text: 'Perfect! See you there', sender: 'friend', timestamp: new Date(threeDaysAgo.getTime() + 360000) },
      { id: '11', text: 'Don\'t forget to bring your notes', sender: 'friend', timestamp: new Date(yesterday) },
      { id: '12', text: 'Got them ready!', sender: 'me', timestamp: new Date(yesterday.getTime() + 240000) },
      { id: '13', text: 'Good morning! On my way', sender: 'friend', timestamp: new Date(today.setHours(9, 30, 0)) },
      { id: '14', text: 'See you soon!', sender: 'me', timestamp: new Date(today.setHours(9, 35, 0)) },
    ],
    'Sam': [
      { id: '1', text: 'Check out this cool article I found', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'Thanks! Will read it later', sender: 'me', timestamp: new Date(lastMonth.getTime() + 600000) },
      { id: '3', text: 'The assignment is due next week', sender: 'friend', timestamp: new Date(twoWeeksAgo) },
      { id: '4', text: 'I know, working on it now', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 180000) },
      { id: '5', text: 'Want to work together?', sender: 'friend', timestamp: new Date(twoWeeksAgo.getTime() + 360000) },
      { id: '6', text: 'Sure! When are you free?', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 540000) },
      { id: '7', text: 'How about tomorrow at 2?', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '8', text: 'Works for me!', sender: 'me', timestamp: new Date(lastWeek.getTime() + 120000) },
      { id: '9', text: 'Did you finish the SENG310 assignment?', sender: 'friend', timestamp: new Date(twoDaysAgo) },
      { id: '10', text: 'Almost done! Just need to review it', sender: 'me', timestamp: new Date(twoDaysAgo.getTime() + 300000) },
      { id: '11', text: 'Nice! Let me know if you need help', sender: 'friend', timestamp: new Date(twoDaysAgo.getTime() + 360000) },
      { id: '12', text: 'Thanks! You\'re the best', sender: 'me', timestamp: new Date(yesterday) },
      { id: '13', text: 'Just submitted it!', sender: 'me', timestamp: new Date(today.setHours(14, 20, 0)) },
      { id: '14', text: 'Congrats! 🎉', sender: 'friend', timestamp: new Date(today.setHours(14, 25, 0)) },
    ],
    'Manya': [
      { id: '1', text: 'Long time no chat!', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'I know! Been so busy', sender: 'me', timestamp: new Date(lastMonth.getTime() + 420000) },
      { id: '3', text: 'We should catch up soon', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 600000) },
      { id: '4', text: 'Coffee this weekend?', sender: 'friend', timestamp: new Date(twoWeeksAgo) },
      { id: '5', text: 'Perfect! Saturday at 11?', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 240000) },
      { id: '6', text: 'See you then!', sender: 'friend', timestamp: new Date(twoWeeksAgo.getTime() + 300000) },
      { id: '7', text: 'That was fun! Let\'s do it again', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '8', text: 'Definitely!', sender: 'me', timestamp: new Date(lastWeek.getTime() + 180000) },
      { id: '9', text: 'Are you coming to the study group tonight?', sender: 'friend', timestamp: new Date(threeDaysAgo) },
      { id: '10', text: 'Yes! What time?', sender: 'me', timestamp: new Date(threeDaysAgo.getTime() + 300000) },
      { id: '11', text: '7 PM at the library', sender: 'friend', timestamp: new Date(threeDaysAgo.getTime() + 360000) },
      { id: '12', text: 'Great, see you then!', sender: 'me', timestamp: new Date(threeDaysAgo.getTime() + 420000) },
      { id: '13', text: 'Running 10 mins late', sender: 'friend', timestamp: new Date(yesterday) },
      { id: '14', text: 'No worries, take your time', sender: 'me', timestamp: new Date(yesterday.getTime() + 120000) },
      { id: '15', text: 'Hey! You around?', sender: 'friend', timestamp: new Date(today.setHours(16, 10, 0)) },
      { id: '16', text: 'Yeah, what\'s up?', sender: 'me', timestamp: new Date(today.setHours(16, 15, 0)) },
    ],
    'Rishon': [
      { id: '1', text: 'Happy birthday! 🎂', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'Thank you so much!', sender: 'me', timestamp: new Date(lastMonth.getTime() + 300000) },
      { id: '3', text: 'Did you get my gift?', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 600000) },
      { id: '4', text: 'Yes! I love it, thank you!', sender: 'me', timestamp: new Date(lastMonth.getTime() + 900000) },
      { id: '5', text: 'Want to grab lunch sometime?', sender: 'friend', timestamp: new Date(twoWeeksAgo) },
      { id: '6', text: 'Sure! This week?', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 240000) },
      { id: '7', text: 'How about Thursday?', sender: 'friend', timestamp: new Date(twoWeeksAgo.getTime() + 480000) },
      { id: '8', text: 'Perfect!', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 540000) },
      { id: '9', text: 'Do you want to grab lunch today?', sender: 'friend', timestamp: new Date(twoDaysAgo) },
      { id: '10', text: 'Sure! Where should we go?', sender: 'me', timestamp: new Date(twoDaysAgo.getTime() + 300000) },
      { id: '11', text: 'How about that new pizza place?', sender: 'friend', timestamp: new Date(twoDaysAgo.getTime() + 600000) },
      { id: '12', text: 'Sounds great!', sender: 'me', timestamp: new Date(yesterday) },
      { id: '13', text: 'Meet you at 12:30?', sender: 'friend', timestamp: new Date(today.setHours(11, 45, 0)) },
      { id: '14', text: 'See you there!', sender: 'me', timestamp: new Date(today.setHours(11, 50, 0)) },
    ],
    'Navya': [
      { id: '1', text: 'Can you help me with this problem?', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'Sure! Send it over', sender: 'me', timestamp: new Date(lastMonth.getTime() + 180000) },
      { id: '3', text: 'You\'re a lifesaver!', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 900000) },
      { id: '4', text: 'Anytime!', sender: 'me', timestamp: new Date(lastMonth.getTime() + 960000) },
      { id: '5', text: 'Movie night this weekend?', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '6', text: 'I\'m in! What are we watching?', sender: 'me', timestamp: new Date(lastWeek.getTime() + 240000) },
      { id: '7', text: 'Let\'s decide when we meet', sender: 'friend', timestamp: new Date(lastWeek.getTime() + 300000) },
      { id: '8', text: 'Thanks for helping me with the project!', sender: 'friend', timestamp: new Date(threeDaysAgo) },
      { id: '9', text: 'No problem! Happy to help', sender: 'me', timestamp: new Date(threeDaysAgo.getTime() + 300000) },
      { id: '10', text: 'I owe you one', sender: 'friend', timestamp: new Date(threeDaysAgo.getTime() + 360000) },
      { id: '11', text: 'Just got an A on that project!', sender: 'friend', timestamp: new Date(yesterday) },
      { id: '12', text: 'That\'s awesome! Congrats!', sender: 'me', timestamp: new Date(yesterday.getTime() + 180000) },
      { id: '13', text: 'Hey, quick question', sender: 'friend', timestamp: new Date(today.setHours(9, 30, 0)) },
      { id: '14', text: 'What\'s up?', sender: 'me', timestamp: new Date(today.setHours(9, 35, 0)) },
    ],
    'Krishika': [
      { id: '1', text: 'Guess what?', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'What??', sender: 'me', timestamp: new Date(lastMonth.getTime() + 120000) },
      { id: '3', text: 'I got the internship!', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 180000) },
      { id: '4', text: 'OMG! Congratulations! 🎉', sender: 'me', timestamp: new Date(lastMonth.getTime() + 300000) },
      { id: '5', text: 'Thank you! So excited!', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 360000) },
      { id: '6', text: 'Want to celebrate?', sender: 'me', timestamp: new Date(twoWeeksAgo) },
      { id: '7', text: 'Yes! Dinner this week?', sender: 'friend', timestamp: new Date(twoWeeksAgo.getTime() + 180000) },
      { id: '8', text: 'Hey! Long time no see', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '9', text: 'I know! We should catch up soon', sender: 'me', timestamp: new Date(lastWeek.getTime() + 300000) },
      { id: '10', text: 'Coffee tomorrow afternoon?', sender: 'friend', timestamp: new Date(lastWeek.getTime() + 360000) },
      { id: '11', text: 'Sounds perfect!', sender: 'me', timestamp: new Date(lastWeek.getTime() + 420000) },
      { id: '12', text: 'That was so nice catching up!', sender: 'friend', timestamp: new Date(twoDaysAgo) },
      { id: '13', text: 'We need to do this more often', sender: 'me', timestamp: new Date(twoDaysAgo.getTime() + 240000) },
      { id: '14', text: 'Definitely!', sender: 'friend', timestamp: new Date(yesterday) },
      { id: '15', text: 'Check this out', sender: 'friend', timestamp: new Date(today.setHours(15, 20, 0)) },
    ],
    'Shreya': [
      { id: '1', text: 'Happy New Year!', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'Happy New Year to you too!', sender: 'me', timestamp: new Date(lastMonth.getTime() + 300000) },
      { id: '3', text: 'Any resolutions?', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 600000) },
      { id: '4', text: 'Exercise more, you?', sender: 'me', timestamp: new Date(lastMonth.getTime() + 900000) },
      { id: '5', text: 'Same! Want to be gym buddies?', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 1200000) },
      { id: '6', text: 'Let\'s do it!', sender: 'me', timestamp: new Date(twoWeeksAgo) },
      { id: '7', text: 'Great workout today!', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '8', text: 'Yeah! I\'m sore though 😅', sender: 'me', timestamp: new Date(lastWeek.getTime() + 180000) },
      { id: '9', text: 'Can you send me the notes from today\'s class?', sender: 'friend', timestamp: new Date(threeDaysAgo) },
      { id: '10', text: 'Sure, I\'ll send them in a bit', sender: 'me', timestamp: new Date(threeDaysAgo.getTime() + 300000) },
      { id: '11', text: 'Thanks! You\'re a star!', sender: 'friend', timestamp: new Date(threeDaysAgo.getTime() + 360000) },
      { id: '12', text: 'Anytime!', sender: 'me', timestamp: new Date(yesterday) },
      { id: '13', text: 'Got them, thank you so much!', sender: 'friend', timestamp: new Date(today.setHours(13, 10, 0)) },
    ],
    'Laksanya': [
      { id: '1', text: 'Did you see the email?', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'Which one?', sender: 'me', timestamp: new Date(lastMonth.getTime() + 240000) },
      { id: '3', text: 'About the deadline extension', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 480000) },
      { id: '4', text: 'Oh yes! That\'s great news', sender: 'me', timestamp: new Date(lastMonth.getTime() + 600000) },
      { id: '5', text: 'Want to work on it together?', sender: 'friend', timestamp: new Date(twoWeeksAgo) },
      { id: '6', text: 'Sure! Library tomorrow?', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 300000) },
      { id: '7', text: 'Perfect! See you at 2', sender: 'friend', timestamp: new Date(twoWeeksAgo.getTime() + 360000) },
      { id: '8', text: 'Are you going to the event on Friday?', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '9', text: 'Planning to! Are you?', sender: 'me', timestamp: new Date(lastWeek.getTime() + 300000) },
      { id: '10', text: 'Yeah! Let\'s go together', sender: 'friend', timestamp: new Date(lastWeek.getTime() + 360000) },
      { id: '11', text: 'Sounds good!', sender: 'me', timestamp: new Date(twoDaysAgo) },
      { id: '12', text: 'What time should we leave?', sender: 'friend', timestamp: new Date(yesterday) },
      { id: '13', text: 'How about 6:30?', sender: 'me', timestamp: new Date(yesterday.getTime() + 300000) },
      { id: '14', text: 'Perfect! Pick you up at 6:30', sender: 'friend', timestamp: new Date(today.setHours(18, 40, 0)) },
    ],
    'Vidit': [
      { id: '1', text: 'Yo! What\'s up?', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'Not much, you?', sender: 'me', timestamp: new Date(lastMonth.getTime() + 180000) },
      { id: '3', text: 'Just chilling', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 360000) },
      { id: '4', text: 'Want to play some games later?', sender: 'friend', timestamp: new Date(twoWeeksAgo) },
      { id: '5', text: 'Sure! What time?', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 240000) },
      { id: '6', text: '8 PM?', sender: 'friend', timestamp: new Date(twoWeeksAgo.getTime() + 300000) },
      { id: '7', text: 'I\'ll be there!', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 360000) },
      { id: '8', text: 'Good game last night!', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '9', text: 'Yeah! We crushed it!', sender: 'me', timestamp: new Date(lastWeek.getTime() + 180000) },
      { id: '10', text: 'Game night this weekend?', sender: 'friend', timestamp: new Date(threeDaysAgo) },
      { id: '11', text: 'I\'m in! Saturday works?', sender: 'me', timestamp: new Date(threeDaysAgo.getTime() + 300000) },
      { id: '12', text: 'Perfect! I\'ll set it up', sender: 'friend', timestamp: new Date(threeDaysAgo.getTime() + 360000) },
      { id: '13', text: 'Don\'t forget to bring snacks', sender: 'friend', timestamp: new Date(yesterday) },
      { id: '14', text: 'On it!', sender: 'me', timestamp: new Date(yesterday.getTime() + 120000) },
      { id: '15', text: 'You online?', sender: 'friend', timestamp: new Date(today.setHours(12, 0, 0)) },
    ],
    'Zoriyon': [
      { id: '1', text: 'How\'s the new semester going?', sender: 'friend', timestamp: new Date(lastMonth) },
      { id: '2', text: 'Pretty good! Busy but manageable', sender: 'me', timestamp: new Date(lastMonth.getTime() + 300000) },
      { id: '3', text: 'That\'s great to hear!', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 360000) },
      { id: '4', text: 'How about you?', sender: 'me', timestamp: new Date(lastMonth.getTime() + 420000) },
      { id: '5', text: 'Same! Lots of work', sender: 'friend', timestamp: new Date(lastMonth.getTime() + 480000) },
      { id: '6', text: 'We should study together', sender: 'me', timestamp: new Date(twoWeeksAgo) },
      { id: '7', text: 'Great idea! When?', sender: 'friend', timestamp: new Date(twoWeeksAgo.getTime() + 240000) },
      { id: '8', text: 'This week good for you?', sender: 'me', timestamp: new Date(twoWeeksAgo.getTime() + 300000) },
      { id: '9', text: 'Wednesday afternoon?', sender: 'friend', timestamp: new Date(lastWeek) },
      { id: '10', text: 'Works for me!', sender: 'me', timestamp: new Date(lastWeek.getTime() + 180000) },
      { id: '11', text: 'Thanks for the study session!', sender: 'friend', timestamp: new Date(threeDaysAgo) },
      { id: '12', text: 'Anytime! Really helpful', sender: 'me', timestamp: new Date(threeDaysAgo.getTime() + 300000) },
      { id: '13', text: 'Same time next week?', sender: 'friend', timestamp: new Date(yesterday) },
      { id: '14', text: 'Sounds good!', sender: 'me', timestamp: new Date(yesterday.getTime() + 240000) },
      { id: '15', text: 'See you then!', sender: 'friend', timestamp: new Date(today.setHours(10, 15, 0)) },
    ],
  };

  return baseMessages[friendName] || [
    { id: '1', text: 'Hey! How are you?', sender: 'friend', timestamp: new Date() },
  ];
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  
  // Demo group is not included initially - only appears after joining with code "demo"
  const [groups, setGroups] = useState<Group[]>([
    { 
      name: 'Group A', 
      type: 'friends', 
      description: '',
      admin: 'Demo User',
      members: ['Demo User', 'Sahil', 'Sam', 'Manya']
    },
    { 
      name: 'Group B', 
      type: 'family', 
      description: '',
      admin: 'Demo User',
      members: ['Demo User', 'Rishon', 'Navya']
    },
    { 
      name: 'Group C', 
      type: 'club', 
      description: '',
      admin: 'Demo User',
      members: ['Demo User', 'Krishika', 'Shreya']
    },
  ]);

  // Demo friends
  const [friends] = useState<Friend[]>([
    { id: '1', name: 'Sahil' },
    { id: '2', name: 'Sam' },
    { id: '3', name: 'Manya' },
    { id: '4', name: 'Rishon' },
    { id: '5', name: 'Navya' },
    { id: '6', name: 'Krishika' },
    { id: '7', name: 'Shreya' },
    { id: '8', name: 'Laksanya' },
    { id: '9', name: 'Vidit' },
    { id: '10', name: 'Zoriyon' },
  ]);

  // Chat messages for each friend (persisted across navigation)
  const [chatMessages, setChatMessages] = useState<{ [friendId: string]: Message[] }>(() => {
    // Initialize with demo messages for each friend
    const initialMessages: { [friendId: string]: Message[] } = {};
    friends.forEach(friend => {
      initialMessages[friend.id] = getInitialDemoMessages(friend.name);
    });
    return initialMessages;
  });

  // Availability for each group (persisted)
  const [availability, setAvailability] = useState<{ [groupName: string]: any }>({});
  
  // Demo events for the Demo group
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      groupName: 'Demo',
      name: 'Team Meeting',
      location: 'Engineering Wing, Room 101',
      date: '2025-11-25',
      startTime: '10:00',
      endTime: '11:00',
      attendees: ['Sahil', 'Sam', 'Manya']
    },
    {
      id: '2',
      groupName: 'Demo',
      name: 'Project Discussion',
      location: 'McPherson Library, Study Room 3',
      date: '2025-11-27',
      startTime: '14:00',
      endTime: '15:30',
      attendees: ['Rishon', 'Navya']
    },
    {
      id: '3',
      groupName: 'Demo',
      name: 'Code Review',
      location: 'Clearihue Building, Room 205',
      date: '2025-11-29',
      startTime: '09:00',
      endTime: '10:00',
      attendees: ['Krishika', 'Shreya', 'Laksanya', 'Vidit']
    }
  ]);

  const handleCreateGroup = (group: Group) => {
    // Add admin and initial members (just the creator) to new group
    const newGroup: Group = {
      ...group,
      admin: 'Demo User',
      members: ['Demo User']
    };
    setGroups([newGroup, ...groups]);
    setCurrentPage('groups');
  };

  const handleJoinGroup = (code: string) => {
    // For demo purposes, joining with "demo" code adds the Demo group
    if (code.toLowerCase() === 'demo') {
      // Check if Demo group already exists
      const demoExists = groups.some(g => g.name === 'Demo');
      if (!demoExists) {
        const demoGroup: Group = {
          name: 'Demo',
          type: 'friends',
          description: 'Demo group with availability data',
          admin: 'Sahil',
          members: ['Demo User', 'Sahil', 'Sam', 'Manya', 'Rishon', 'Navya', 'Krishika', 'Shreya', 'Laksanya', 'Vidit', 'Zoriyon']
        };
        setGroups([demoGroup, ...groups]);
      }
    }
  };

  const handleLeaveGroup = (groupName: string) => {
    setGroups(groups.filter(g => g.name !== groupName));
    // Also remove events from that group
    setEvents(events.filter(e => e.groupName !== groupName));
  };

  const handleViewGroup = (groupName: string) => {
    setSelectedGroup(groupName);
    setCurrentPage('group-calendar');
  };

  const handleSelectFriend = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      setSelectedFriend(friend);
      setCurrentPage('chat');
    }
  };

  const handleAddEvent = (groupName: string, event: Omit<Event, 'id' | 'groupName'>) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      groupName,
    };
    setEvents([...events, newEvent]);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
    // Reset groups to initial state (without Demo group)
    setGroups([
      { 
        name: 'Group A', 
        type: 'friends', 
        description: '',
        admin: 'Demo User',
        members: ['Demo User', 'Sahil', 'Sam', 'Manya']
      },
      { 
        name: 'Group B', 
        type: 'family', 
        description: '',
        admin: 'Demo User',
        members: ['Demo User', 'Rishon', 'Navya']
      },
      { 
        name: 'Group C', 
        type: 'club', 
        description: '',
        admin: 'Demo User',
        members: ['Demo User', 'Krishika', 'Shreya']
      },
    ]);
    // Reset events to demo events only
    setEvents([
      {
        id: '1',
        groupName: 'Demo',
        name: 'Team Meeting',
        location: 'Engineering Wing, Room 101',
        date: '2025-11-25',
        startTime: '10:00',
        endTime: '11:00',
        attendees: ['Sahil', 'Sam', 'Manya']
      },
      {
        id: '2',
        groupName: 'Demo',
        name: 'Project Discussion',
        location: 'McPherson Library, Study Room 3',
        date: '2025-11-27',
        startTime: '14:00',
        endTime: '15:30',
        attendees: ['Rishon', 'Navya']
      },
      {
        id: '3',
        groupName: 'Demo',
        name: 'Code Review',
        location: 'Clearihue Building, Room 205',
        date: '2025-11-29',
        startTime: '09:00',
        endTime: '10:00',
        attendees: ['Krishika', 'Shreya', 'Laksanya', 'Vidit']
      }
    ]);
    // Reset chat messages to demo messages
    const resetMessages: { [friendId: string]: Message[] } = {};
    friends.forEach(friend => {
      resetMessages[friend.id] = getInitialDemoMessages(friend.name);
    });
    setChatMessages(resetMessages);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      {/* Mobile Phone Frame */}
      <div className="relative w-full max-w-[390px] h-[844px] bg-black rounded-[60px] shadow-2xl p-3">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
        
        {/* Phone Screen */}
        <div className="relative w-full h-full bg-[#f5f1e8] rounded-[48px] overflow-hidden">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                <Login onLogin={() => setIsLoggedIn(true)} />
              </motion.div>
            ) : (
              <>
                {currentPage === 'home' && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <Home onNavigate={setCurrentPage} onLogout={handleLogout} />
                  </motion.div>
                )}
                {currentPage === 'groups' && (
                  <motion.div
                    key="groups"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <GroupLanding groups={groups} onNavigate={setCurrentPage} onViewGroup={handleViewGroup} onLeaveGroup={handleLeaveGroup} onLogout={handleLogout} />
                  </motion.div>
                )}
                {currentPage === 'join-group' && (
                  <motion.div
                    key="join-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <JoinGroup onNavigate={setCurrentPage} onJoinGroup={handleJoinGroup} onLogout={handleLogout} />
                  </motion.div>
                )}
                {currentPage === 'create-group' && (
                  <motion.div
                    key="create-group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <CreateGroup onNavigate={setCurrentPage} onCreateGroup={handleCreateGroup} onLogout={handleLogout} />
                  </motion.div>
                )}
                {currentPage === 'group-calendar' && (
                  <motion.div
                    key="group-calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <GroupCalendar 
                      groupName={selectedGroup} 
                      events={events.filter(e => e.groupName === selectedGroup)}
                      friends={friends}
                      onBack={() => setCurrentPage('groups')} 
                      onAddEvent={(event) => handleAddEvent(selectedGroup, event)}
                      onLogout={handleLogout} 
                    />
                  </motion.div>
                )}
                {currentPage === 'friends' && (
                  <motion.div
                    key="friends"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <FriendsList 
                      friends={friends}
                      onNavigate={setCurrentPage}
                      onSelectFriend={handleSelectFriend}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                )}
                {currentPage === 'chat' && selectedFriend && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <Chat 
                      friend={selectedFriend}
                      onBack={() => setCurrentPage('friends')}
                      onLogout={handleLogout}
                      messages={chatMessages[selectedFriend.id]}
                      setMessages={(messages) => setChatMessages(prev => ({ ...prev, [selectedFriend.id]: messages }))}
                    />
                  </motion.div>
                )}
                {currentPage === 'calendar' && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <PersonalCalendar 
                      events={events}
                      onNavigate={setCurrentPage}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                )}
                {currentPage === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <Profile 
                      groups={groups}
                      events={events}
                      friends={friends}
                      onNavigate={setCurrentPage}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                )}
                {currentPage === 'events' && (
                  <motion.div
                    key="events"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <PlannedEvents 
                      events={events}
                      onNavigate={setCurrentPage}
                      onLogout={handleLogout}
                    />
                  </motion.div>
                )}
                {currentPage === 'availability' && (
                  <motion.div
                    key="availability"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="h-full"
                  >
                    <Availability 
                      groups={groups}
                      availability={availability}
                      onSaveAvailability={(groupName, dayAvailability) => 
                        setAvailability(prev => ({ ...prev, [groupName]: dayAvailability }))
                      }
                      onBack={() => setCurrentPage('home')}
                    />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}