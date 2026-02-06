import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Clock, Check, X, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { calculateAvailability } from '../utils/availability';

interface Friend {
  id: string;
  name: string;
}

interface TimeSlotDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  hour: number;
  timeLabel: string;
  friends: Friend[];
  onCreateEvent?: () => void;
}

export function TimeSlotDetailsDialog({ 
  isOpen, 
  onClose, 
  date, 
  hour,
  timeLabel,
  friends,
  onCreateEvent 
}: TimeSlotDetailsDialogProps) {
  const dateString = date.toISOString().split('T')[0];
  const allFriendNames = friends.map(f => f.name);
  
  const availability = calculateAvailability(allFriendNames, dateString, hour);
  
  // Separate friends into available and unavailable
  const availableFriends: Friend[] = [];
  const unavailableFriends: Friend[] = [];
  
  friends.forEach(friend => {
    const isAvailable = calculateAvailability([friend.name], dateString, hour).allAvailable;
    if (isAvailable) {
      availableFriends.push(friend);
    } else {
      unavailableFriends.push(friend);
    }
  });

  const { ripples: createRipples, flashes: createFlashes, addRipple: addCreateRipple } = useRipple();
  const { ripples: closeRipples, flashes: closeFlashes, addRipple: addCloseRipple } = useRipple();

  const handleCreateEvent = (e: React.MouseEvent) => {
    addCreateRipple(e);
    if (onCreateEvent) {
      onCreateEvent();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[360px] max-h-[85vh] overflow-y-auto border-2 border-black rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Slot Details
          </DialogTitle>
          <div className="space-y-1 pt-2">
            <p className="text-sm text-gray-600">
              {date.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </p>
            <p className={`text-sm ${availability.color}`}>
              {timeLabel} - {availability.availableCount}/{availability.totalCount} friends available
            </p>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Availability Summary Card */}
          <div className={`p-3 rounded-lg border-2 border-black ${availability.bgColor}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${availability.color}`}>
                  {availability.percentage === 100 
                    ? 'Perfect! Everyone is free' 
                    : availability.percentage >= 60
                    ? 'Most friends are available'
                    : availability.percentage >= 30
                    ? 'Some friends are available'
                    : 'Few friends are available'}
                </p>
              </div>
              <div className={`text-2xl ${availability.color}`}>
                {availability.percentage === 100 ? '✓' : availability.percentage >= 60 ? '😊' : availability.percentage >= 30 ? '😐' : '😞'}
              </div>
            </div>
          </div>

          {/* Available Friends */}
          {availableFriends.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Check className="w-4 h-4" />
                <span>Available ({availableFriends.length})</span>
              </div>
              <div className="space-y-1">
                {availableFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{friend.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unavailable Friends */}
          {unavailableFriends.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <X className="w-4 h-4" />
                <span>Unavailable ({unavailableFriends.length})</span>
              </div>
              <div className="space-y-1">
                {unavailableFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-600">{friend.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t-2 border-gray-200">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              addCloseRipple(e);
              onClose();
            }}
            className="flex-1 px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors relative overflow-hidden"
          >
            <span className="relative z-10">Close</span>
            <Ripple ripples={closeRipples} flashes={closeFlashes} />
          </motion.button>
          {onCreateEvent && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateEvent}
              className="flex-1 px-4 py-2 bg-[#6b5ce7] text-white border-2 border-black rounded-lg hover:bg-[#5a4bc6] transition-colors relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-1">
                <Calendar className="w-4 h-4" />
                Create Event
              </span>
              <Ripple ripples={createRipples} flashes={createFlashes} />
            </motion.button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
