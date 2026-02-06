import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { Settings } from 'lucide-react';

interface GroupButtonProps {
  groupName: string;
  groupType: string;
  onClick: () => void;
  onSettingsClick: (e: React.MouseEvent) => void;
}

export function GroupButton({ groupName, groupType, onClick, onSettingsClick }: GroupButtonProps) {
  const { ripples, flashes, addRipple } = useRipple();
  const { ripples: settingsRipples, flashes: settingsFlashes, addRipple: addSettingsRipple } = useRipple();

  const getTypeIcon = () => {
    switch (groupType) {
      case 'friends':
        return '👥';
      case 'family':
        return '👨‍👩‍👧‍👦';
      case 'club':
        return '🎯';
      default:
        return '📁';
    }
  };

  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addSettingsRipple(e);
    setTimeout(() => onSettingsClick(e), 150);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        addRipple(e);
        onClick();
      }}
      className="w-full p-5 border-2 border-black rounded-lg bg-white active:bg-gray-100 text-left relative overflow-hidden"
    >
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 flex-1">
          <span>{groupName}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-300 capitalize flex items-center gap-1">
            <span>{getTypeIcon()}</span>
            <span>{groupType}</span>
          </span>
        </div>
        <motion.div
          whileTap={{ scale: 0.85 }}
          onClick={handleSettingsClick}
          className="w-8 h-8 rounded-full border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 relative overflow-hidden"
        >
          <Settings className="w-4 h-4 relative z-10" />
          <Ripple ripples={settingsRipples} flashes={settingsFlashes} color="bg-blue-400/40" />
        </motion.div>
      </div>
      <Ripple ripples={ripples} flashes={flashes} color="bg-purple-400/40" />
    </motion.button>
  );
}
