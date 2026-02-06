import { useState } from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Users, User, Shield, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface CreateGroupProps {
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'join-group') => void;
  onCreateGroup: (group: { name: string; type: string; description: string }) => void;
  onLogout: () => void;
}

export function CreateGroup({ onNavigate, onCreateGroup, onLogout }: CreateGroupProps) {
  const [groupName, setGroupName] = useState('');
  const [groupType, setGroupType] = useState<'friends' | 'family' | 'club' | 'other'>('friends');
  const [description, setDescription] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const { ripples: friendsRipples, addRipple: addFriendsRipple } = useRipple();
  const { ripples: familyRipples, addRipple: addFamilyRipple } = useRipple();
  const { ripples: clubRipples, addRipple: addClubRipple } = useRipple();
  const { ripples: otherRipples, addRipple: addOtherRipple } = useRipple();
  const { ripples: createRipples, addRipple: addCreateRipple } = useRipple();

  const handleCreateGroup = () => {
    // Generate a random code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setShowDialog(true);
  };

  const handleConfirm = () => {
    onCreateGroup({
      name: groupName || 'New Group',
      type: groupType,
      description: description,
    });
    setShowDialog(false);
    setGroupName('');
    setDescription('');
  };

  return (
    <div className="h-full flex flex-col bg-[#f5f1e8] relative">
      <Header onLogout={onLogout} />
      
      <main className="flex-1 px-6 py-6 overflow-y-auto pb-24">
        <div className="w-full">
          <h2 className="mb-6">Create Group</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block mb-2">Enter Group Name:</label>
              <Input
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border-2 border-black rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block mb-3">Select Group Type</label>
              <div className="grid grid-cols-3 gap-3">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    addFriendsRipple(e);
                    setGroupType('friends');
                  }}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 relative overflow-hidden transition-all ${
                    groupType === 'friends' 
                      ? 'bg-blue-100 border-blue-500 shadow-md' 
                      : 'bg-white border-black'
                  }`}
                >
                  {groupType === 'friends' && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Users className={`w-5 h-5 relative z-10 ${groupType === 'friends' ? 'text-blue-600' : ''}`} />
                  <span className={`text-sm relative z-10 ${groupType === 'friends' ? 'font-semibold text-blue-700' : ''}`}>Friends</span>
                  <Ripple ripples={friendsRipples.ripples} flashes={friendsRipples.flashes} color="bg-yellow-400/40" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    addFamilyRipple(e);
                    setGroupType('family');
                  }}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 relative overflow-hidden transition-all ${
                    groupType === 'family' 
                      ? 'bg-green-100 border-green-500 shadow-md' 
                      : 'bg-white border-black'
                  }`}
                >
                  {groupType === 'family' && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Users className={`w-5 h-5 relative z-10 ${groupType === 'family' ? 'text-green-600' : ''}`} />
                  <span className={`text-sm relative z-10 ${groupType === 'family' ? 'font-semibold text-green-700' : ''}`}>Family</span>
                  <Ripple ripples={familyRipples.ripples} flashes={familyRipples.flashes} color="bg-yellow-400/40" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={(e) => {
                    addClubRipple(e);
                    setGroupType('club');
                  }}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center gap-2 relative overflow-hidden transition-all ${
                    groupType === 'club' 
                      ? 'bg-purple-100 border-purple-500 shadow-md' 
                      : 'bg-white border-black'
                  }`}
                >
                  {groupType === 'club' && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center z-10">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <Shield className={`w-5 h-5 relative z-10 ${groupType === 'club' ? 'text-purple-600' : ''}`} />
                  <span className={`text-sm relative z-10 ${groupType === 'club' ? 'font-semibold text-purple-700' : ''}`}>Club</span>
                  <Ripple ripples={clubRipples.ripples} flashes={clubRipples.flashes} color="bg-yellow-400/40" />
                </motion.button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  addOtherRipple(e);
                  setGroupType('other');
                }}
                className={`mt-3 px-4 py-2 border-2 rounded-lg relative overflow-hidden transition-all ${
                  groupType === 'other' 
                    ? 'bg-orange-100 border-orange-500 shadow-md font-semibold text-orange-700' 
                    : 'bg-white border-black'
                }`}
              >
                {groupType === 'other' && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center z-10">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="relative z-10">Other...</span>
                <Ripple ripples={otherRipples.ripples} flashes={otherRipples.flashes} color="bg-yellow-400/40" />
              </motion.button>
            </div>

            <div>
              <label className="block mb-2">Enter Group Description:</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[100px] border-2 border-black rounded-lg bg-white"
              />
            </div>

            <div className="pt-4 pb-4">
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={(e) => {
                    addCreateRipple(e);
                    handleCreateGroup();
                  }}
                  className="w-full h-12 border-2 border-black rounded-full bg-white active:bg-gray-100 text-black relative overflow-hidden"
                >
                  <span className="relative z-10">Create Group: <span className="ml-2 underline">Generate Code</span></span>
                  <Ripple ripples={createRipples.ripples} flashes={createRipples.flashes} color="bg-green-400/40" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav currentPage="groups" onNavigate={onNavigate} />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="border-2 border-black bg-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Group Created!</DialogTitle>
            <DialogDescription className="pt-4">
              Your group has been created successfully. Share this code with others to invite them:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-6">
            <div className="px-6 py-3 border-2 border-black rounded-lg bg-gray-100">
              <p className="text-2xl tracking-widest">{generatedCode}</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleConfirm}
              className="w-full h-10 border-2 border-black rounded-lg bg-white active:bg-gray-100 text-black"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
