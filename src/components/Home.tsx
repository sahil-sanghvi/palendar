import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';

interface HomeProps {
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'friends' | 'calendar' | 'profile' | 'events' | 'availability') => void;
  onLogout: () => void;
}

export function Home({ onNavigate, onLogout }: HomeProps) {
  const { ripples: calendarRipples, addRipple: addCalendarRipple } = useRipple();
  const { ripples: profileRipples, addRipple: addProfileRipple } = useRipple();
  const { ripples: eventsRipples, addRipple: addEventsRipple } = useRipple();
  const { ripples: availabilityRipples, addRipple: addAvailabilityRipple } = useRipple();

  return (
    <div className="h-full flex flex-col relative">
      <Header onLogout={onLogout} />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-full space-y-4">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                addCalendarRipple(e);
                setTimeout(() => onNavigate('calendar'), 150);
              }}
              variant="outline"
              className="w-full h-16 border-2 border-black rounded-lg bg-white active:bg-gray-100 relative overflow-hidden text-base"
            >
              <span className="relative z-10">📅 View Your Calendar</span>
              <Ripple ripples={calendarRipples.ripples} flashes={calendarRipples.flashes} color="bg-blue-400/40" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                addProfileRipple(e);
                setTimeout(() => onNavigate('profile'), 150);
              }}
              variant="outline"
              className="w-full h-16 border-2 border-black rounded-lg bg-white active:bg-gray-100 relative overflow-hidden text-base"
            >
              <span className="relative z-10">👤 View Your Profile</span>
              <Ripple ripples={profileRipples.ripples} flashes={profileRipples.flashes} color="bg-blue-400/40" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                addEventsRipple(e);
                setTimeout(() => onNavigate('events'), 150);
              }}
              variant="outline"
              className="w-full h-16 border-2 border-black rounded-lg bg-white active:bg-gray-100 relative overflow-hidden text-base"
            >
              <span className="relative z-10">📋 View Planned Events</span>
              <Ripple ripples={eventsRipples.ripples} flashes={eventsRipples.flashes} color="bg-blue-400/40" />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                addAvailabilityRipple(e);
                setTimeout(() => onNavigate('availability'), 150);
              }}
              variant="outline"
              className="w-full h-16 border-2 border-black rounded-lg bg-white active:bg-gray-100 relative overflow-hidden text-base"
            >
              <span className="relative z-10">🕒 Manage Availability</span>
              <Ripple ripples={availabilityRipples.ripples} flashes={availabilityRipples.flashes} color="bg-blue-400/40" />
            </Button>
          </motion.div>
        </div>
      </main>

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}