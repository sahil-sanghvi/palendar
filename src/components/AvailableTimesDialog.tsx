import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Clock, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { TIME_SLOTS, calculateAvailability, findBestTimeSlots } from '../utils/availability';
import { TimeSlotDetailsDialog } from './TimeSlotDetailsDialog';

interface Friend {
  id: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

interface AvailableTimesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  friends: Friend[];
  onSelectTime?: (hour: number) => void;
  events?: Event[];
}

export function AvailableTimesDialog({ 
  isOpen, 
  onClose, 
  date, 
  friends,
  onSelectTime,
  events = []
}: AvailableTimesDialogProps) {
  const [showTimeDetails, setShowTimeDetails] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [selectedTimeLabel, setSelectedTimeLabel] = useState<string>('8:00 AM');
  
  const dateString = date.toISOString().split('T')[0];
  const allFriendNames = friends.map(f => f.name);
  
  // Get best time slots where most/all friends are available
  const bestSlots = findBestTimeSlots(allFriendNames, dateString, 13);
  
  // Get events for this specific date
  const dayEvents = events.filter(event => event.date === dateString);

  const handleSelectTime = (hour: number, label: string, e: React.MouseEvent) => {
    setSelectedHour(hour);
    setSelectedTimeLabel(label);
    setShowTimeDetails(true);
  };

  const handleCreateEventFromDetails = () => {
    setShowTimeDetails(false);
    if (onSelectTime) {
      onSelectTime(selectedHour);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] max-h-[80vh] overflow-y-auto border-2 border-black rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {dayEvents.length > 0 ? 'Events & Availability' : 'Available Times'}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {date.toLocaleDateString('en-US', { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </p>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {/* Existing Events Section */}
          {dayEvents.length > 0 && (
            <div className="pb-3 border-b-2 border-gray-200">
              <h4 className="text-sm mb-2 flex items-center gap-1">
                <span className="w-4 h-2 bg-[#6b5ce7] rounded inline-block"></span>
                Scheduled Events ({dayEvents.length})
              </h4>
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 bg-[#6b5ce7]/10 border border-[#6b5ce7] rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm">{event.name}</div>
                        <div className="text-xs text-gray-600 mt-0.5">
                          {event.startTime} - {event.endTime}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {event.attendees.length} {event.attendees.length === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                    {event.location && (
                      <div className="text-xs text-gray-600 mt-1">📍 {event.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Group availability for this day</span>
          </div>

          {/* Time Slots with Availability */}
          <div className="space-y-2">
            {TIME_SLOTS.map((slot) => {
              const availability = calculateAvailability(allFriendNames, dateString, slot.hour);
              
              return (
                <TimeSlotCard
                  key={slot.hour}
                  hour={slot.hour}
                  label={slot.label}
                  availability={availability}
                  onSelect={(e) => handleSelectTime(slot.hour, slot.label, e)}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t-2 border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Availability Legend:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 border border-black rounded"></div>
                <span>All free (100%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-100 border border-black rounded"></div>
                <span>Most free (60%+)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-100 border border-black rounded"></div>
                <span>Some free (30%+)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-100 border border-black rounded"></div>
                <span>Few/None free</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Time Slot Details Dialog */}
      <TimeSlotDetailsDialog
        isOpen={showTimeDetails}
        onClose={() => setShowTimeDetails(false)}
        date={date}
        hour={selectedHour}
        timeLabel={selectedTimeLabel}
        friends={friends}
        onCreateEvent={handleCreateEventFromDetails}
      />
    </Dialog>
  );
}

interface TimeSlotCardProps {
  hour: number;
  label: string;
  availability: {
    availableCount: number;
    totalCount: number;
    percentage: number;
    color: string;
    bgColor: string;
    allAvailable: boolean;
  };
  onSelect: (e: React.MouseEvent) => void;
}

function TimeSlotCard({ hour, label, availability, onSelect }: TimeSlotCardProps) {
  const { ripples, flashes, addRipple } = useRipple();

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        addRipple(e);
        onSelect(e);
      }}
      className={`
        w-full p-3 rounded-lg border-2 border-black transition-all
        ${availability.bgColor}
        hover:shadow-md relative overflow-hidden
      `}
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <Clock className={`w-4 h-4 ${availability.color}`} />
          <span className={`${availability.color}`}>
            {label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${availability.color}`}>
            {availability.availableCount}/{availability.totalCount}
          </span>
          {availability.allAvailable && (
            <span className="text-green-700">✓</span>
          )}
        </div>
      </div>
      <Ripple ripples={ripples} flashes={flashes} />
    </motion.button>
  );
}
