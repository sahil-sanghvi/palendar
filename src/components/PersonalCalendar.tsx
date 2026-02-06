import { useState } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';

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

interface PersonalCalendarProps {
  events: Event[];
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'friends') => void;
  onLogout: () => void;
}

export function PersonalCalendar({ events, onNavigate, onLogout }: PersonalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { ripples: prevRipples, addRipple: addPrevRipple } = useRipple();
  const { ripples: nextRipples, addRipple: addNextRipple } = useRipple();

  // Get calendar data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create array of days
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Get events for a specific day
  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  // Check if a day is today
  const isToday = (day: number | null) => {
    if (day === null) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const handlePrevMonth = (e: React.MouseEvent) => {
    addPrevRipple(e);
    setCurrentDate(new Date(year, month - 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    addNextRipple(e);
    setCurrentDate(new Date(year, month + 1));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="relative h-full flex flex-col bg-[#f5f1e8]">
      <Header onLogout={onLogout} />
      
      <div className="px-4 py-3 bg-white border-b-2 border-black">
        <h2>Your Calendar</h2>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handlePrevMonth}
            className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
          >
            <ChevronLeft className="w-5 h-5 relative z-10" />
            <Ripple ripples={prevRipples.ripples} flashes={prevRipples.flashes} />
          </motion.button>
          <h3>{monthName} {year}</h3>
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleNextMonth}
            className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
          >
            <ChevronRight className="w-5 h-5 relative z-10" />
            <Ripple ripples={nextRipples.ripples} flashes={nextRipples.flashes} />
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border-2 border-black rounded-lg p-3 mb-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs text-gray-600 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center rounded-lg text-sm
                    ${day === null ? '' : 'border border-gray-200'}
                    ${isToday(day) ? 'bg-blue-100 border-blue-500 border-2' : ''}
                    ${hasEvents && !isToday(day) ? 'bg-green-50' : ''}
                  `}
                >
                  {day && (
                    <div className="flex flex-col items-center">
                      <span className={isToday(day) ? 'font-bold' : ''}>{day}</span>
                      {hasEvents && (
                        <div className="w-1 h-1 bg-green-600 rounded-full mt-0.5"></div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="space-y-3">
          <h3 className="text-sm text-gray-600">Upcoming Events</h3>
          {events.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-4 text-center text-gray-500">
              No events scheduled. Join a group to see events!
            </div>
          ) : (
            events
              .filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return eventDate >= today;
              })
              .sort((a, b) => {
                const dateCompare = a.date.localeCompare(b.date);
                if (dateCompare !== 0) return dateCompare;
                return a.startTime.localeCompare(b.startTime);
              })
              .slice(0, 5)
              .map(event => (
                <div
                  key={event.id}
                  className="bg-white border-2 border-black rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{event.name}</h4>
                      <p className="text-xs text-gray-600">{event.groupName}</p>
                    </div>
                    <span className="text-xs bg-blue-100 px-2 py-1 rounded border border-blue-300">
                      {new Date(event.date).toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>⏰ {formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
                    <p>📍 {event.location}</p>
                    {event.attendees.length > 0 && (
                      <p>👥 {event.attendees.join(', ')}</p>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </main>

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}
