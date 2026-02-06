import { useState } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { GroupButton } from './GroupButton';
import { GroupSettingsDialog } from './GroupSettingsDialog';

interface Group {
  name: string;
  type: string;
  description: string;
  admin?: string;
  members?: string[];
}

interface GroupLandingProps {
  groups: Group[];
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'join-group') => void;
  onViewGroup: (groupName: string) => void;
  onLeaveGroup: (groupName: string) => void;
  onLogout: () => void;
}

export function GroupLanding({ groups, onNavigate, onViewGroup, onLeaveGroup, onLogout }: GroupLandingProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const { ripples: createRipples, addRipple: addCreateRipple } = useRipple();
  const { ripples: joinRipples, addRipple: addJoinRipple } = useRipple();

  const handleSettingsClick = (group: Group) => {
    setSelectedGroup(group);
    setShowSettings(true);
  };

  return (
    <div className="h-full flex flex-col relative">
      <Header onLogout={onLogout} />
      
      <main className="flex-1 px-6 py-6 pb-24 overflow-y-auto">
        <div className="w-full">
          <h2 className="mb-6">Your Groups</h2>
          
          <div className="space-y-4">
            {groups.map((group, index) => (
              <GroupButton
                key={index}
                groupName={group.name}
                groupType={group.type}
                onClick={() => onViewGroup(group.name)}
                onSettingsClick={() => handleSettingsClick(group)}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 my-6">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span className="ml-1">...</span>
          </div>

          <div className="flex gap-3 justify-center">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                addCreateRipple(e);
                onNavigate('create-group');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black bg-[#6b5ce7] text-white active:bg-[#5a4bc6] relative overflow-hidden"
            >
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Create Group</span>
              <Ripple ripples={createRipples.ripples} flashes={createRipples.flashes} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                addJoinRipple(e);
                onNavigate('join-group');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black bg-white active:bg-gray-100 relative overflow-hidden"
            >
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Join Group</span>
              <Ripple ripples={joinRipples.ripples} flashes={joinRipples.flashes} color="bg-green-400/40" />
            </motion.button>
          </div>
        </div>
      </main>

      <BottomNav currentPage="groups" onNavigate={onNavigate} />

      {selectedGroup && (
        <GroupSettingsDialog
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          groupName={selectedGroup.name}
          groupType={selectedGroup.type}
          adminName={selectedGroup.admin || 'Demo User'}
          members={selectedGroup.members || ['Demo User']}
          onLeaveGroup={() => onLeaveGroup(selectedGroup.name)}
        />
      )}
    </div>
  );
}
