// Mock availability data for demo friends
// Each friend has availability for different days and time slots
// Time slots are in 1-hour increments from 8 AM to 8 PM

export interface TimeSlot {
  hour: number; // 8-20 (8 AM to 8 PM)
  label: string;
}

export const TIME_SLOTS: TimeSlot[] = [
  { hour: 8, label: '8:00 AM' },
  { hour: 9, label: '9:00 AM' },
  { hour: 10, label: '10:00 AM' },
  { hour: 11, label: '11:00 AM' },
  { hour: 12, label: '12:00 PM' },
  { hour: 13, label: '1:00 PM' },
  { hour: 14, label: '2:00 PM' },
  { hour: 15, label: '3:00 PM' },
  { hour: 16, label: '4:00 PM' },
  { hour: 17, label: '5:00 PM' },
  { hour: 18, label: '6:00 PM' },
  { hour: 19, label: '7:00 PM' },
  { hour: 20, label: '8:00 PM' },
];

// Generate mock availability for friends
// Returns true if friend is available at that time
const generateMockAvailability = (friendName: string, date: string, hour: number): boolean => {
  // Parse the date to get day of month
  const dayOfMonth = parseInt(date.split('-')[2]);
  
  // Days when EVERYONE is busy all day (no availability - RED)
  const busyDaysForAll = [5, 11, 18, 25]; // Nov 5, 11, 18, 25
  if (busyDaysForAll.includes(dayOfMonth)) {
    return false;
  }
  
  // Days when EVERYONE is free all day (full availability - GREEN)
  const freeDaysForAll = [7, 14, 21, 28]; // Nov 7, 14, 21, 28
  if (freeDaysForAll.includes(dayOfMonth)) {
    return true;
  }
  
  // For remaining days, create varied patterns (YELLOW/ORANGE - partial availability)
  // Different patterns for different friends to create realistic mixed availability
  switch (friendName) {
    case 'Sahil':
      // Busy on odd days, morning/evening person
      if (dayOfMonth % 2 === 1) {
        return hour < 12 || hour >= 17; // Morning/evening only
      }
      return hour >= 10 && hour <= 16; // Midday on even days
      
    case 'Sam':
      // Busy on days divisible by 3, night owl
      if (dayOfMonth % 3 === 0) {
        return hour >= 18; // Evening only
      }
      return hour >= 11; // After 11 AM otherwise
      
    case 'Manya':
      // Busy on days 1-10, afternoon person
      if (dayOfMonth <= 10) {
        return hour >= 14 && hour <= 18; // Afternoon only
      }
      return hour >= 12; // After noon otherwise
      
    case 'Rishon':
      // Busy on even days, early bird
      if (dayOfMonth % 2 === 0) {
        return hour <= 12; // Morning only
      }
      return hour <= 16; // Until 4 PM otherwise
      
    case 'Navya':
      // Busy mid-month (15-20), lunch break pattern
      if (dayOfMonth >= 15 && dayOfMonth <= 20) {
        return hour < 11 || hour > 15; // Morning/late afternoon only
      }
      return hour < 12 || hour > 14; // Skip lunch otherwise
      
    case 'Krishika':
      // Busy on days divisible by 4, regular schedule
      if (dayOfMonth % 4 === 0) {
        return hour >= 15; // Late afternoon only
      }
      return !(hour >= 9 && hour <= 12) && !(hour >= 14 && hour <= 17);
      
    case 'Shreya':
      // Busy on days 20-30, variable schedule
      if (dayOfMonth >= 20 && dayOfMonth <= 30) {
        return hour >= 13 && hour <= 17; // Afternoon only
      }
      return hour < 14 || hour >= 16; // Mixed otherwise
      
    case 'Laksanya':
      // Busy first week and last week
      if (dayOfMonth <= 7 || dayOfMonth >= 24) {
        return hour >= 10 && hour <= 14; // Midday only
      }
      return hour >= 9 && hour <= 18; // Mostly available otherwise
      
    case 'Vidit':
      // Busy on odd days, afternoon/evening person
      if (dayOfMonth % 2 === 1) {
        return hour >= 16; // Late afternoon only
      }
      return hour >= 13; // After 1 PM otherwise
      
    case 'Zoriyon':
      // Busy on days divisible by 5, mid-day person
      if (dayOfMonth % 5 === 0) {
        return hour >= 12 && hour <= 15; // Lunch hours only
      }
      return hour >= 10 && hour <= 18; // Mid-day otherwise
      
    default:
      // Unknown friends - 50% availability
      const hash = (friendName + date + hour).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return hash % 2 === 0;
  }
};

export interface AvailabilityResult {
  availableCount: number;
  totalCount: number;
  percentage: number;
  color: string;
  bgColor: string;
  allAvailable: boolean;
}

// Calculate availability for a specific time slot given selected friends
export const calculateAvailability = (
  friends: string[],
  date: string,
  hour: number
): AvailabilityResult => {
  if (friends.length === 0) {
    return {
      availableCount: 0,
      totalCount: 0,
      percentage: 100,
      color: 'text-green-700',
      bgColor: 'bg-green-200',
      allAvailable: true,
    };
  }

  const availableCount = friends.filter(friend => 
    generateMockAvailability(friend, date, hour)
  ).length;

  const percentage = (availableCount / friends.length) * 100;
  
  let color: string;
  let bgColor: string;
  
  // Only show green when ALL friends are available
  if (percentage === 100) {
    color = 'text-green-700';
    bgColor = 'bg-green-200';
  } else if (percentage >= 60) {
    // Fair availability - most friends free (yellow)
    color = 'text-yellow-700';
    bgColor = 'bg-yellow-100';
  } else if (percentage >= 30) {
    // Some availability - half friends free (orange)
    color = 'text-orange-700';
    bgColor = 'bg-orange-100';
  } else if (percentage > 0) {
    // Poor availability - few friends free (light red)
    color = 'text-red-600';
    bgColor = 'bg-red-50';
  } else {
    // No availability - no one free (dark red)
    color = 'text-red-800';
    bgColor = 'bg-red-100';
  }

  return {
    availableCount,
    totalCount: friends.length,
    percentage,
    color,
    bgColor,
    allAvailable: percentage === 100,
  };
};

// Find best time slots where all friends are available
export const findBestTimeSlots = (
  friends: string[],
  date: string,
  limit: number = 5
): Array<{ hour: number; label: string; availableCount: number }> => {
  const slots = TIME_SLOTS.map(slot => {
    const availability = calculateAvailability(friends, date, slot.hour);
    return {
      hour: slot.hour,
      label: slot.label,
      availableCount: availability.availableCount,
    };
  });

  // Sort by availability (highest first)
  return slots
    .sort((a, b) => b.availableCount - a.availableCount)
    .slice(0, limit);
};
