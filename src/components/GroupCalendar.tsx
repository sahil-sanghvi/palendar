import { useState } from 'react';
import { Header } from './Header';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { AddEventDialog } from './AddEventDialog';
import { EventDetailsDialog } from './EventDetailsDialog';
import { AvailableTimesDialog } from './AvailableTimesDialog';
import { findBestTimeSlots } from '../utils/availability';

interface Event {
  id: string;
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

interface GroupCalendarProps {
  groupName: string;
  events: Event[];
  friends: Friend[];
  onBack: () => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onLogout: () => void;
}

export function GroupCalendar({ groupName, events, friends, onBack, onAddEvent, onLogout }: GroupCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 1)); // November 2025
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showAvailableTimes, setShowAvailableTimes] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<number | undefined>(undefined);
  
  const { ripples: backRipples, flashes: backFlashes, addRipple: addBackRipple } = useRipple();
  const { ripples: prevRipples, flashes: prevFlashes, addRipple: addPrevRipple } = useRipple();
  const { ripples: nextRipples, flashes: nextFlashes, addRipple: addNextRipple } = useRipple();
  const { ripples: addRipples, flashes: addFlashes, addRipple: addAddRipple } = useRipple();

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const hasGoodAvailability = (date: Date | null): boolean => {
    if (!date || friends.length === 0) return false;
    const dateString = date.toISOString().split('T')[0];
    const allFriendNames = friends.map(f => f.name);
    
    const bestSlots = findBestTimeSlots(allFriendNames, dateString, 13); // Check all slots
    
    // Green dot only if most slots have ALL friends available (everyone free all day)
    const slotsWithAllFree = bestSlots.filter(slot => slot.availableCount === allFriendNames.length);
    return slotsWithAllFree.length >= 10; // At least 10 hours where everyone is free
  };

  const handleDayClick = (date: Date | null, e: React.MouseEvent) => {
    if (!date) return;
    setSelectedDate(date);
    
    // Always show available times dialog (which will also show existing events)
    setShowAvailableTimes(true);
  };

  const handleTimeSelected = (hour: number) => {
    // When user selects a time from available times, open add event dialog with that time pre-filled
    setSelectedHour(hour);
    setShowAvailableTimes(false);
    setShowAddEvent(true);
  };

  const handleAddEventClick = (e: React.MouseEvent) => {
    addAddRipple(e);
    setSelectedHour(undefined); // Reset selected hour when clicking the + button
    setShowAddEvent(true);
  };

  const handleAddEvent = (event: Omit<Event, 'id'>) => {
    onAddEvent(event);
    setShowAddEvent(false);
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="relative h-full flex flex-col bg-[#f5f1e8]">
      <Header onLogout={onLogout} />
      
      <div className="px-4 py-3 bg-white border-b-2 border-black flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            addBackRipple(e);
            onBack();
          }}
          className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
        >
          <ChevronLeft className="w-5 h-5 relative z-10" />
          <Ripple ripples={backRipples} flashes={backFlashes} />
        </motion.button>
        <h2>{groupName} Calendar</h2>
      </div>

      <main className="flex-1 overflow-auto p-4">
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              addPrevRipple(e);
              changeMonth('prev');
            }}
            className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
          >
            <ChevronLeft className="w-5 h-5 relative z-10" />
            <Ripple ripples={prevRipples} flashes={prevFlashes} />
          </motion.button>
          
          <h3 className="text-lg">{formatMonthYear(currentDate)}</h3>
          
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              addNextRipple(e);
              changeMonth('next');
            }}
            className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
          >
            <ChevronRight className="w-5 h-5 relative z-10" />
            <Ripple ripples={nextRipples} flashes={nextFlashes} />
          </motion.button>
        </div>

        {/* Legend */}
        <div className="mb-2 flex items-center gap-3 text-xs text-gray-600 flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500 border border-green-700"></div>
            <span>Good availability</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 bg-[#6b5ce7] rounded"></div>
            <span>Has events</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-500">Click day for details</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border-2 border-black rounded-lg overflow-hidden mb-4">
          {/* Week day headers */}
          <div className="grid grid-cols-7 border-b-2 border-black">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-xs border-r-2 border-black last:border-r-0 bg-gray-50">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              const dayEvents = getEventsForDate(date);
              const isToday = date && date.getTime() === today.getTime();
              const goodAvailability = hasGoodAvailability(date);
              
              return (
                <motion.div
                  key={index}
                  whileTap={date ? { scale: 0.95 } : {}}
                  onClick={(e) => handleDayClick(date, e)}
                  className={`
                    min-h-[70px] p-1 border-r-2 border-b-2 border-black last:border-r-0 relative
                    ${index >= days.length - 7 ? 'border-b-0' : ''}
                    ${date ? 'cursor-pointer hover:bg-gray-50 transition-colors' : 'bg-gray-100'}
                    ${isToday ? 'bg-blue-50' : ''}
                  `}
                >
                  {date && (
                    <div className="h-full flex flex-col">
                      <div className={`text-xs mb-1 flex items-center justify-between ${isToday ? 'font-semibold text-blue-600' : ''}`}>
                        <span>{date.getDate()}</span>
                        {goodAvailability && (
                          <div 
                            className="w-2 h-2 rounded-full bg-green-500 border border-green-700" 
                            title="Good availability"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-[10px] px-1 py-0.5 bg-[#6b5ce7] text-white rounded truncate"
                            title={event.name}
                          >
                            {event.name}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-gray-600 px-1">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        {events.length > 0 && (
          <div className="bg-white border-2 border-black rounded-lg p-4">
            <h3 className="mb-3">Upcoming Events</h3>
            <div className="space-y-2">
              {events
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    <div
                      key={event.id}
                      className="p-2 bg-[#f5f1e8] border border-black rounded text-sm"
                    >
                      <div>{event.name}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.startTime}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </main>

      {/* Floating Add Event Button */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleAddEventClick}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#6b5ce7] text-white rounded-full border-2 border-black shadow-lg flex items-center justify-center hover:bg-[#5a4bc6] transition-colors relative overflow-hidden"
      >
        <Plus className="w-6 h-6 relative z-10" />
        <Ripple ripples={addRipples} flashes={addFlashes} />
      </motion.button>

      {/* Add Event Dialog */}
      <AddEventDialog
        isOpen={showAddEvent}
        onClose={() => {
          setShowAddEvent(false);
          setSelectedHour(undefined); // Reset selected hour when closing
        }}
        onAddEvent={handleAddEvent}
        groupName={groupName}
        friends={friends}
        selectedDate={selectedDate || undefined}
        selectedHour={selectedHour}
      />

      {/* Event Details Dialog */}
      <EventDetailsDialog
        isOpen={showEventDetails}
        onClose={() => setShowEventDetails(false)}
        events={events}
        selectedDate={selectedDate}
      />

      {/* Available Times Dialog */}
      {selectedDate && (
        <AvailableTimesDialog
          isOpen={showAvailableTimes}
          onClose={() => setShowAvailableTimes(false)}
          date={selectedDate}
          friends={friends}
          onSelectTime={handleTimeSelected}
          events={events}
        />
      )}
    </div>
  );
}
