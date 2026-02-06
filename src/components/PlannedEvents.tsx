import { useState } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Calendar, Clock, MapPin, Users, Search } from 'lucide-react';

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

interface PlannedEventsProps {
  events: Event[];
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'friends') => void;
  onLogout: () => void;
}

export function PlannedEvents({ events, onNavigate, onLogout }: PlannedEventsProps) {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('default', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isUpcoming = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  };

  // Filter events
  const filteredEvents = events
    .filter(event => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.name.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.groupName.toLowerCase().includes(query) ||
          event.attendees.some(a => a.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .filter(event => {
      // Time filter
      if (filter === 'upcoming') return isUpcoming(event.date);
      if (filter === 'past') return !isUpcoming(event.date);
      return true;
    })
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });

  // Group events by date
  const groupedEvents: { [key: string]: Event[] } = {};
  filteredEvents.forEach(event => {
    if (!groupedEvents[event.date]) {
      groupedEvents[event.date] = [];
    }
    groupedEvents[event.date].push(event);
  });

  return (
    <div className="relative h-full flex flex-col bg-[#f5f1e8]">
      <Header onLogout={onLogout} />
      
      <div className="px-4 py-3 bg-white border-b-2 border-black">
        <h2>Planned Events</h2>
      </div>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-3 sticky top-0 bg-[#f5f1e8] z-10">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-lg bg-white"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('upcoming')}
              className={`
                flex-1 py-2 px-3 rounded-lg border-2 border-black text-sm transition-colors
                ${filter === 'upcoming' ? 'bg-black text-white' : 'bg-white text-black'}
              `}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`
                flex-1 py-2 px-3 rounded-lg border-2 border-black text-sm transition-colors
                ${filter === 'past' ? 'bg-black text-white' : 'bg-white text-black'}
              `}
            >
              Past
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`
                flex-1 py-2 px-3 rounded-lg border-2 border-black text-sm transition-colors
                ${filter === 'all' ? 'bg-black text-white' : 'bg-white text-black'}
              `}
            >
              All
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="px-4 space-y-4">
          {events.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-sm mb-2">No Events Yet</h3>
              <p className="text-xs text-gray-500">
                Join a group to see planned events!
              </p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-6 text-center">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-sm mb-2">No Events Found</h3>
              <p className="text-xs text-gray-500">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            Object.entries(groupedEvents).map(([date, dateEvents]) => (
              <div key={date} className="mb-6">
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`
                    px-3 py-1 rounded-full border-2 text-xs
                    ${isUpcoming(date) 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-gray-100 border-gray-400 text-gray-600'
                    }
                  `}>
                    {formatDate(date)}
                  </div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Events for this date */}
                <div className="space-y-3">
                  {dateEvents.map(event => (
                    <div
                      key={event.id}
                      className="bg-white border-2 border-black rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Event Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-sm mb-1">{event.name}</h4>
                          <span className="inline-block text-xs bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                            {event.groupName}
                          </span>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>

                        {event.attendees.length > 0 && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <Users className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="text-xs text-gray-500">Attendees:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.attendees.map((attendee, idx) => (
                                  <span 
                                    key={idx}
                                    className="text-xs bg-gray-100 px-2 py-0.5 rounded border border-gray-300"
                                  >
                                    {attendee}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
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
