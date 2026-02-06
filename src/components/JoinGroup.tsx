import { useState } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface JoinGroupProps {
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'join-group') => void;
  onJoinGroup: (code: string) => void;
  onLogout: () => void;
}

export function JoinGroup({ onNavigate, onJoinGroup, onLogout }: JoinGroupProps) {
  const [groupCode, setGroupCode] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { ripples: joinRipples, addRipple: addJoinRipple } = useRipple();

  const handleJoinGroup = () => {
    if (!groupCode.trim()) {
      setErrorMessage('Please enter a group code');
      setShowErrorDialog(true);
      return;
    }

    // For demo purposes, only accept "demo" as valid code
    if (groupCode.toLowerCase() === 'demo') {
      onJoinGroup(groupCode.toLowerCase());
      setGroupCode('');
      onNavigate('groups');
    } else {
      setErrorMessage('Invalid group code. Try "demo" for the demo group.');
      setShowErrorDialog(true);
    }
  };

  return (
    <div className="h-full flex flex-col relative">
      <Header onLogout={onLogout} />
      
      <main className="flex-1 px-8 py-12 pb-24 overflow-y-auto flex flex-col items-center justify-start">
        <div className="w-full max-w-xs space-y-8">
          {/* Code Input */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-600 text-center">Enter Group Code</label>
            <Input
              type="text"
              placeholder="Enter 4-6 digit code (e.g. demo)"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleJoinGroup();
                }
              }}
              className="w-full h-14 text-center border-2 border-black rounded-lg bg-white text-lg tracking-widest"
              maxLength={20}
            />
            <p className="text-xs text-gray-500 text-center">Tip: Try "demo" to join the demo group</p>
          </div>

          {/* Join Group Button */}
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              onClick={(e) => {
                addJoinRipple(e);
                handleJoinGroup();
              }}
              className="w-full h-14 border-2 border-black rounded-lg bg-white hover:bg-gray-100 text-black relative overflow-hidden"
            >
              <span className="relative z-10">JOIN GROUP</span>
              <Ripple ripples={joinRipples.ripples} flashes={joinRipples.flashes} color="bg-green-400/40" />
            </Button>
          </motion.div>
        </div>
      </main>

      <BottomNav currentPage="groups" onNavigate={onNavigate} />

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="w-[90%] max-w-sm">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <Button 
            onClick={() => setShowErrorDialog(false)}
            className="w-full"
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
