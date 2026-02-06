import { Users, Shield, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface GroupSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  groupType: string;
  adminName: string;
  members: string[];
  onLeaveGroup: () => void;
}

export function GroupSettingsDialog({
  isOpen,
  onClose,
  groupName,
  groupType,
  adminName,
  members,
  onLeaveGroup,
}: GroupSettingsDialogProps) {
  const { ripples: leaveRipples, addRipple: addLeaveRipple } = useRipple();
  const { ripples: closeRipples, addRipple: addCloseRipple } = useRipple();

  const handleLeaveGroup = (e: React.MouseEvent) => {
    addLeaveRipple(e);
    setTimeout(() => {
      onLeaveGroup();
      onClose();
    }, 150);
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-2 border-black bg-white max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{getTypeIcon()}</span>
            <span>Group Settings</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            View and manage group settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Group Name */}
          <div className="bg-gray-50 border-2 border-black rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Group Name</p>
            <p className="text-sm">{groupName}</p>
          </div>

          {/* Group Type */}
          <div className="bg-gray-50 border-2 border-black rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-1">Group Type</p>
            <p className="text-sm capitalize">{groupType}</p>
          </div>

          {/* Admin */}
          <div className="bg-gray-50 border-2 border-black rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3 h-3 text-blue-600" />
              <p className="text-xs text-gray-600">Admin</p>
            </div>
            <p className="text-sm">{adminName}</p>
          </div>

          {/* Members */}
          <div className="bg-gray-50 border-2 border-black rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3 h-3 text-purple-600" />
              <p className="text-xs text-gray-600">Members ({members.length})</p>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {members.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm py-1"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                    {member[0]}
                  </div>
                  <span>{member}</span>
                  {member === adminName && (
                    <span className="ml-auto text-xs bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Leave Group Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleLeaveGroup}
              variant="outline"
              className="w-full h-10 border-2 border-red-500 rounded-lg bg-white hover:bg-red-50 text-red-600 active:bg-red-100 relative overflow-hidden"
            >
              <LogOut className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Leave Group</span>
              <Ripple ripples={leaveRipples.ripples} flashes={leaveRipples.flashes} color="bg-red-400/40" />
            </Button>
          </motion.div>

          {/* Close Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                addCloseRipple(e);
                setTimeout(() => onClose(), 150);
              }}
              className="w-full h-10 border-2 border-black rounded-lg bg-white active:bg-gray-100 text-black relative overflow-hidden"
            >
              <span className="relative z-10">Close</span>
              <Ripple ripples={closeRipples.ripples} flashes={closeRipples.flashes} />
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
