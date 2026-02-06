import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Info } from 'lucide-react';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

interface Group {
  name: string;
  type: string;
}

interface AvailabilityProps {
  groups: Group[];
  onBack: () => void;
  availability: { [groupName: string]: DayAvailability };
  onSaveAvailability: (groupName: string, dayAvailability: DayAvailability) => void;
}

interface DayAvailability {
  [day: string]: {
    enabled: boolean;
    fullDay: boolean;
    availableFrom: string;
    availableTo: string;
    status: string;
    reason: string;
    comments: string;
  };
}

const DAYS = [
  { short: 'M', full: 'Mon', name: 'Monday' },
  { short: 'T', full: 'Tue', name: 'Tuesday' },
  { short: 'W', full: 'Wed', name: 'Wednesday' },
  { short: 'T', full: 'Thu', name: 'Thursday' },
  { short: 'F', full: 'Fri', name: 'Friday' },
  { short: 'S', full: 'Sat', name: 'Saturday' },
  { short: 'S', full: 'Sun', name: 'Sunday' },
];

const REASONS = [
  'School',
  'Work',
  'Other job',
  'Personal',
  'Vacation',
  'Meeting',
];

const getDefaultDayData = () => ({
  enabled: false,
  fullDay: false,
  availableFrom: '09:00',
  availableTo: '17:00',
  status: 'Available',
  reason: 'School',
  comments: '',
});

const getDefaultAvailability = (): DayAvailability => {
  const availability: DayAvailability = {};
  DAYS.forEach(day => {
    availability[day.name] = getDefaultDayData();
  });
  return availability;
};

export function Availability({ groups, onBack, availability, onSaveAvailability }: AvailabilityProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('__GENERAL__');
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [dayAvailability, setDayAvailability] = useState<DayAvailability>(
    availability[selectedGroup] || getDefaultAvailability()
  );

  const currentDayData = dayAvailability[selectedDay];

  const handleGroupChange = (groupName: string) => {
    setSelectedGroup(groupName);
    setDayAvailability(availability[groupName] || getDefaultAvailability());
  };

  const handleDayClick = (dayName: string) => {
    setSelectedDay(dayName);
  };

  const updateDayData = (field: string, value: any) => {
    setDayAvailability({
      ...dayAvailability,
      [selectedDay]: {
        ...currentDayData,
        [field]: value,
      },
    });
  };

  const toggleDayEnabled = (dayName: string) => {
    setDayAvailability({
      ...dayAvailability,
      [dayName]: {
        ...dayAvailability[dayName],
        enabled: !dayAvailability[dayName].enabled,
      },
    });
  };

  const handleSave = () => {
    onSaveAvailability(selectedGroup, dayAvailability);
    // Show success message or navigate back
    console.log('Saving availability for', selectedGroup, dayAvailability);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 -ml-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        <h1 className="absolute left-1/2 -translate-x-1/2">Availability</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className="text-[#6b5ce7]"
        >
          Save
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {/* Group Selection */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Group</span>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => handleGroupChange(e.target.value)}
            className="px-3 py-1 text-gray-700 bg-transparent border-none outline-none appearance-none cursor-pointer"
            style={{ 
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0 center',
              backgroundSize: '20px',
              paddingRight: '24px'
            }}
          >
            <option value="__GENERAL__">All Groups</option>
            {groups.map((group) => (
              <option key={group.name} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {selectedGroup === '__GENERAL__' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              Setting general availability will apply to all groups unless you set specific availability for a group.
            </p>
          </div>
        )}

        {/* Schedule Section */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">Schedule</span>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 mb-6">
          {DAYS.map((day) => {
            const isDayEnabled = dayAvailability[day.name].enabled;
            const dayStatus = dayAvailability[day.name].status;
            const isSelected = selectedDay === day.name;
            
            // Determine dot color based on status
            let dotColor = 'bg-gray-300';
            if (isDayEnabled) {
              if (dayStatus === 'Available') {
                dotColor = 'bg-[#00bcd4]';
              } else if (dayStatus === 'Busy') {
                dotColor = 'bg-red-500';
              } else if (dayStatus === 'Tentative') {
                dotColor = 'bg-yellow-500';
              }
            }
            
            return (
              <motion.button
                key={day.name}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDayClick(day.name)}
                onDoubleClick={() => toggleDayEnabled(day.name)}
                className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-xl transition-colors ${
                  isSelected ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <span className="text-xs text-gray-500">{day.full}</span>
                <span className="text-gray-900">{day.short}</span>
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${dotColor}`} />
              </motion.button>
            );
          })}
        </div>

        {/* Selected Day Label */}
        <div className="mb-4">
          <h3 className="text-sm">
            {selectedDay} Settings
          </h3>
        </div>

        {/* Enable/Disable Day */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-700">Enable {selectedDay}</span>
          <Switch 
            checked={currentDayData.enabled} 
            onCheckedChange={(checked) => updateDayData('enabled', checked)}
            className="data-[state=checked]:bg-[#00bcd4]"
          />
        </div>

        {currentDayData.enabled && (
          <>
            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Status</span>
              <select
                value={currentDayData.status}
                onChange={(e) => updateDayData('status', e.target.value)}
                className="px-3 py-1 text-gray-700 bg-transparent border-none outline-none appearance-none cursor-pointer"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0 center',
                  backgroundSize: '20px',
                  paddingRight: '24px'
                }}
              >
                <option value="Available">Available</option>
                <option value="Busy">Busy</option>
                <option value="Tentative">Tentative</option>
              </select>
            </div>

            {/* Full Day Toggle */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-700">Full Day</span>
              <Switch 
                checked={currentDayData.fullDay} 
                onCheckedChange={(checked) => updateDayData('fullDay', checked)}
                className="data-[state=checked]:bg-[#ff6b35]"
              />
            </div>

            {/* Time Range */}
            {!currentDayData.fullDay && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700">Available from</span>
                  <input
                    type="time"
                    value={currentDayData.availableFrom}
                    onChange={(e) => updateDayData('availableFrom', e.target.value)}
                    className="px-3 py-1 text-gray-700 bg-gray-100 border-none outline-none rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-700">Available to</span>
                  <input
                    type="time"
                    value={currentDayData.availableTo}
                    onChange={(e) => updateDayData('availableTo', e.target.value)}
                    className="px-3 py-1 text-gray-700 bg-gray-100 border-none outline-none rounded-lg"
                  />
                </div>
              </>
            )}

            {/* Reason */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700">Reason</span>
              <select
                value={currentDayData.reason}
                onChange={(e) => updateDayData('reason', e.target.value)}
                className="px-3 py-1 text-gray-700 bg-transparent border-none outline-none appearance-none cursor-pointer"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0 center',
                  backgroundSize: '20px',
                  paddingRight: '24px'
                }}
              >
                {REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Comments */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Comments</label>
              <Textarea
                value={currentDayData.comments}
                onChange={(e) => updateDayData('comments', e.target.value)}
                placeholder="Enter comments"
                className="w-full min-h-[100px] bg-gray-50 border-none resize-none"
              />
            </div>
          </>
        )}

        {!currentDayData.enabled && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">Enable {selectedDay} to set availability</p>
          </div>
        )}
      </div>

      {/* Bottom indicator (for mobile home bar) */}
      <div className="h-8 flex items-center justify-center">
        <div className="w-32 h-1 bg-black rounded-full" />
      </div>
    </div>
  );
}