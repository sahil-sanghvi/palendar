import { User, Bell } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';

interface HeaderProps {
  onLogout?: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const { ripples: userRipples, addRipple: addUserRipple } = useRipple();
  const { ripples: bellRipples, addRipple: addBellRipple } = useRipple();

  return (
    <header className="bg-white border-b-2 border-black px-4 py-3 pt-6">
      <div className="flex items-center justify-between">
        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            addUserRipple(e);
            onLogout?.();
          }}
          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
        >
          <User className="w-5 h-5 relative z-10" />
          <Ripple ripples={userRipples.ripples} flashes={userRipples.flashes} color="bg-red-400/40" />
        </motion.button>
        <h1 className="tracking-wider">PALENDAR</h1>
        <motion.button 
          whileTap={{ scale: 0.85 }}
          onClick={addBellRipple}
          className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
        >
          <Bell className="w-5 h-5 relative z-10" />
          <Ripple ripples={bellRipples.ripples} flashes={bellRipples.flashes} />
        </motion.button>
      </div>
    </header>
  );
}