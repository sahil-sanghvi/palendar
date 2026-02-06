import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X, Check, Clock, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { TIME_SLOTS, calculateAvailability } from '../utils/availability';
import { TimeSlotDetailsDialog } from './TimeSlotDetailsDialog';

interface Friend {
  id: string;
  name: string;
}

interface AddEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: {
    name: string;
    location: string;
    date: string;
    startTime: string;
    endTime: string;
    attendees: string[];
  }) => void;
  groupName: string;
  friends: Friend[];
  selectedDate?: Date;
  selectedHour?: number;
}

export function AddEventDialog({ isOpen, onClose, onAddEvent, groupName, friends, selectedDate, selectedHour }: AddEventDialogProps) {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(
    selectedDate 
      ? selectedDate.toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0]
  );
  
  // Initialize times based on selectedHour prop
  const getInitialTimes = () => {
    if (selectedHour !== undefined) {
      const startHour = selectedHour.toString().padStart(2, '0');
      const endHour = (selectedHour + 1).toString().padStart(2, '0');
      return {
        start: `${startHour}:00`,
        end: `${endHour}:00`,
        hour: selectedHour
      };
    }
    return {
      start: '10:00',
      end: '11:00',
      hour: null
    };
  };
  
  const initialTimes = getInitialTimes();
  const [startTime, setStartTime] = useState(initialTimes.start);
  const [endTime, setEndTime] = useState(initialTimes.end);
  // Select all friends by default
  const [selectedFriends, setSelectedFriends] = useState<string[]>(friends.map(f => f.name));
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number[]>(initialTimes.hour !== null ? [initialTimes.hour] : []);
  const [showTimeDetails, setShowTimeDetails] = useState(false);
  const [detailsHour, setDetailsHour] = useState<number>(8);
  const [detailsTimeLabel, setDetailsTimeLabel] = useState<string>('8:00 AM');

  const { ripples: cancelRipples, flashes: cancelFlashes, addRipple: addCancelRipple } = useRipple();
  const { ripples: createRipples, flashes: createFlashes, addRipple: addCreateRipple } = useRipple();
  const { ripples: confirmRipples, flashes: confirmFlashes, addRipple: addConfirmRipple } = useRipple();
  const { ripples: backRipples, flashes: backFlashes, addRipple: addBackRipple } = useRipple();

  // Update times when selectedHour prop changes
  useEffect(() => {
    if (selectedHour !== undefined) {
      setSelectedHours([selectedHour]);
      const startHour = selectedHour.toString().padStart(2, '0');
      const endHour = (selectedHour + 1).toString().padStart(2, '0');
      setStartTime(`${startHour}:00`);
      setEndTime(`${endHour}:00`);
    }
  }, [selectedHour]);

  // Update start and end times when selectedHours changes
  useEffect(() => {
    if (selectedHours.length > 0) {
      const sortedHours = [...selectedHours].sort((a, b) => a - b);
      const firstHour = sortedHours[0];
      const lastHour = sortedHours[sortedHours.length - 1];
      setStartTime(`${firstHour.toString().padStart(2, '0')}:00`);
      setEndTime(`${(lastHour + 1).toString().padStart(2, '0')}:00`);
    }
  }, [selectedHours]);

  // Update date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  }, [selectedDate]);

  // Reset selected friends when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFriends(friends.map(f => f.name));
    }
  }, [isOpen, friends]);

  const handleToggleFriend = (friendName: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendName) 
        ? prev.filter(f => f !== friendName)
        : [...prev, friendName]
    );
  };

  const handleSelectTimeSlot = (hour: number) => {
    setSelectedHours(prev => {
      if (prev.includes(hour)) {
        // Remove if already selected
        return prev.filter(h => h !== hour);
      } else {
        // Add if not selected
        return [...prev, hour];
      }
    });
  };

  const handleShowTimeDetails = (hour: number, label: string) => {
    setDetailsHour(hour);
    setDetailsTimeLabel(label);
    setShowTimeDetails(true);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    addCreateRipple(e);
    if (eventName.trim() && location.trim() && date && startTime && endTime) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmCreate = (e: React.MouseEvent) => {
    addConfirmRipple(e);
    onAddEvent({
      name: eventName.trim(),
      location: location.trim(),
      date,
      startTime,
      endTime,
      attendees: selectedFriends,
    });
    // Reset form
    setEventName('');
    setLocation('');
    setDate(new Date().toISOString().split('T')[0]);
    setStartTime('10:00');
    setEndTime('11:00');
    setSelectedFriends([]);
    setSelectedHours([]);
    setShowConfirmation(false);
  };

  const handleCancel = (e: React.MouseEvent) => {
    addCancelRipple(e);
    setEventName('');
    setLocation('');
    setSelectedFriends([]);
    setSelectedHours([]);
    setShowConfirmation(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[360px] max-h-[90vh] overflow-y-auto border-2 border-black rounded-xl">
        <DialogHeader>
          <DialogTitle>Add Event to {groupName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              placeholder="Team Meeting"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="border-2 border-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Room 101, Library"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-2 border-black"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border-2 border-black"
            />
          </div>

          <div className="space-y-2">
            <Label>Invite Friends</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 border-2 border-black rounded-lg">
              {friends.map((friend) => {
                const isSelected = selectedFriends.includes(friend.name);
                return (
                  <motion.div
                    key={friend.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleToggleFriend(friend.name)}
                    className={`
                      p-2 border-2 border-black rounded-lg cursor-pointer transition-colors
                      ${isSelected ? 'bg-[#6b5ce7] text-white' : 'bg-white hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`
                        w-5 h-5 rounded border-2 border-black flex items-center justify-center
                        ${isSelected ? 'bg-white' : 'bg-white'}
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-[#6b5ce7]" />}
                      </div>
                      <span className="text-xs truncate">{friend.name}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            {selectedFriends.length > 0 && (
              <p className="text-xs text-gray-600">{selectedFriends.length} friend(s) selected</p>
            )}
          </div>

          {/* Availability Heat Map */}
          {selectedFriends.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Label>Select Time Slot(s) (Friend Availability)</Label>
              </div>
              <p className="text-xs text-gray-600">
                Colors show how many selected friends are free. Click to select multiple time slots, tap <Info className="inline w-3 h-3" /> for details.
              </p>
              {selectedHours.length > 0 && (
                <p className="text-xs text-[#6b5ce7]">
                  {selectedHours.length} time slot{selectedHours.length > 1 ? 's' : ''} selected ({startTime} - {endTime})
                </p>
              )}
              <div className="p-3 bg-gray-50 border-2 border-black rounded-lg space-y-1 max-h-64 overflow-y-auto">
                {TIME_SLOTS.map((slot) => {
                  const availability = calculateAvailability(selectedFriends, date, slot.hour);
                  const isSelected = selectedHours.includes(slot.hour);
                  
                  return (
                    <div key={slot.hour} className="flex gap-1">
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelectTimeSlot(slot.hour)}
                        className={`
                          flex-1 p-2 rounded-lg border-2 transition-all
                          ${isSelected ? 'border-[#6b5ce7] ring-2 ring-[#6b5ce7] ring-offset-1' : 'border-black'}
                          ${availability.bgColor}
                          hover:shadow-md
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${availability.color}`}>
                            {slot.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${availability.color}`}>
                              {availability.availableCount}/{availability.totalCount}
                            </span>
                            {availability.allAvailable && (
                              <span className="text-xs">✓</span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowTimeDetails(slot.hour, slot.label);
                        }}
                        className="w-8 h-full bg-gray-200 hover:bg-gray-300 border-2 border-black rounded-lg flex items-center justify-center transition-colors"
                        title="See who's available"
                      >
                        <Info className="w-4 h-4 text-gray-700" />
                      </motion.button>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-200 border border-black rounded"></div>
                  <span>All</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-100 border border-black rounded"></div>
                  <span>Most</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-orange-100 border border-black rounded"></div>
                  <span>Some</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-100 border border-black rounded"></div>
                  <span>Few/None</span>
                </div>
              </div>
            </div>
          )}

          {/* Manual Time Entry (if no friends selected or want to override) */}
          {selectedFriends.length === 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-2 border-black"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-2 border-black"
                />
              </div>
            </div>
          )}
        </div>

        {!showConfirmation ? (
          <div className="flex gap-2 justify-end">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleCancel}
              className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors relative overflow-hidden"
            >
              <span className="relative z-10">Cancel</span>
              <Ripple ripples={cancelRipples} flashes={cancelFlashes} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleSubmit}
              disabled={!eventName.trim() || !location.trim()}
              className="px-4 py-2 bg-[#6b5ce7] text-white border-2 border-black rounded-lg hover:bg-[#5a4bc6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              <span className="relative z-10">Create Event</span>
              <Ripple ripples={createRipples} flashes={createFlashes} />
            </motion.button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <p className="text-sm">Are you sure you want to create this event?</p>
              <p className="text-xs text-gray-600 mt-1">
                <strong>{eventName}</strong> on {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at {startTime}
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={(e) => {
                  addBackRipple(e);
                  setShowConfirmation(false);
                }}
                className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition-colors relative overflow-hidden"
              >
                <span className="relative z-10">Go Back</span>
                <Ripple ripples={backRipples} flashes={backFlashes} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleConfirmCreate}
                className="px-4 py-2 bg-[#6b5ce7] text-white border-2 border-black rounded-lg hover:bg-[#5a4bc6] transition-colors relative overflow-hidden"
              >
                <span className="relative z-10">Confirm Create</span>
                <Ripple ripples={confirmRipples} flashes={confirmFlashes} />
              </motion.button>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Time Slot Details Dialog */}
      {selectedFriends.length > 0 && (
        <TimeSlotDetailsDialog
          isOpen={showTimeDetails}
          onClose={() => setShowTimeDetails(false)}
          date={new Date(date)}
          hour={detailsHour}
          timeLabel={detailsTimeLabel}
          friends={friends.filter(f => selectedFriends.includes(f.name))}
        />
      )}
    </Dialog>
  );
}
