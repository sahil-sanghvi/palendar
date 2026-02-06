import { Home, Users, Menu, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'friends' | 'availability') => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { ripples: homeRipples, addRipple: addHomeRipple } = useRipple();
  const { ripples: groupsRipples, addRipple: addGroupsRipple } = useRipple();
  const { ripples: friendsRipples, addRipple: addFriendsRipple } = useRipple();
  const { ripples: menuRipples, addRipple: addMenuRipple } = useRipple();

  return (
    <>
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-black">
        <div className="flex items-center justify-around px-4 py-3 pb-6">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              addHomeRipple(e);
              onNavigate('home');
            }}
            className={`flex flex-col items-center gap-1 p-2 relative overflow-hidden rounded-lg ${
              currentPage === 'home' ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <Home className="w-6 h-6 relative z-10" />
            <span className="text-xs relative z-10">Home</span>
            {currentPage === 'home' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#6b5ce7] rounded-full"></div>
            )}
            <Ripple ripples={homeRipples.ripples} flashes={homeRipples.flashes} color="bg-green-400/40" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              addGroupsRipple(e);
              onNavigate('groups');
            }}
            className={`flex flex-col items-center gap-1 p-2 relative overflow-hidden rounded-lg ${
              currentPage === 'groups' ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <Users className="w-6 h-6 relative z-10" />
            <span className="text-xs relative z-10">Groups</span>
            {currentPage === 'groups' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#6b5ce7] rounded-full"></div>
            )}
            <Ripple ripples={groupsRipples.ripples} flashes={groupsRipples.flashes} color="bg-green-400/40" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              addFriendsRipple(e);
              onNavigate('friends');
            }}
            className={`flex flex-col items-center gap-1 p-2 relative overflow-hidden rounded-lg ${
              currentPage === 'friends' ? 'opacity-100' : 'opacity-60'
            }`}
          >
            <Heart className="w-6 h-6 relative z-10" />
            <span className="text-xs relative z-10">Friends</span>
            {currentPage === 'friends' && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#6b5ce7] rounded-full"></div>
            )}
            <Ripple ripples={friendsRipples.ripples} flashes={friendsRipples.flashes} color="bg-green-400/40" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              addMenuRipple(e);
              setMenuOpen(true);
            }}
            className="flex flex-col items-center gap-1 p-2 opacity-60 relative overflow-hidden rounded-lg"
          >
            <Menu className="w-6 h-6 relative z-10" />
            <span className="text-xs relative z-10">Menu</span>
            <Ripple ripples={menuRipples.ripples} flashes={menuRipples.flashes} color="bg-green-400/40" />
          </motion.button>
        </div>
      </nav>

      {/* Menu Dialog */}
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="max-w-[320px] border-2 border-black rounded-lg bg-white">
          <DialogHeader>
            <DialogTitle>Menu</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMenuOpen(false);
                onNavigate('availability');
              }}
              className="w-full text-left px-4 py-3 border-2 border-black rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              Add/Edit Availability
            </motion.button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}