import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { MapPin, Clock, Users, Calendar } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  selectedDate: Date | null;
}

export function EventDetailsDialog({ isOpen, onClose, events, selectedDate }: EventDetailsDialogProps) {
  if (!selectedDate) return null;

  const dateString = selectedDate.toISOString().split('T')[0];
  const dayEvents = events.filter(event => event.date === dateString);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px] max-h-[90vh] overflow-y-auto border-2 border-black rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {formatDate(selectedDate)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {dayEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No events scheduled for this day.</p>
            </div>
          ) : (
            dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-[#f5f1e8] border-2 border-black rounded-lg space-y-3"
              >
                <h3 className="text-lg">{event.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      {formatTime(event.startTime)} - {formatTime(event.endTime)}
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{event.location}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="mb-1">Attendees ({event.attendees.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {event.attendees.map((attendee, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-white border border-black rounded text-xs"
                          >
                            {attendee}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
