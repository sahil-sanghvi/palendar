import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Search, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';
import { useState } from 'react';

interface Friend {
  id: string;
  name: string;
}

interface FriendsListProps {
  friends: Friend[];
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'friends') => void;
  onSelectFriend: (friendId: string) => void;
  onLogout: () => void;
}

export function FriendsList({ friends, onNavigate, onSelectFriend, onLogout }: FriendsListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col relative bg-[#f5f1e8]">
      <Header onLogout={onLogout} />
      
      <div className="px-4 py-3 bg-white border-b-2 border-black">
        <h2>Friends</h2>
      </div>

      <main className="flex-1 overflow-auto pb-24 px-4 pt-4">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-lg bg-white"
            />
          </div>
        </div>

        {/* Friends List */}
        <div className="space-y-2">
          {filteredFriends.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No friends found</p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={friend}
                onSelectFriend={onSelectFriend}
              />
            ))
          )}
        </div>
      </main>

      <BottomNav currentPage="friends" onNavigate={onNavigate} />
    </div>
  );
}

interface FriendItemProps {
  friend: Friend;
  onSelectFriend: (friendId: string) => void;
}

function FriendItem({ friend, onSelectFriend }: FriendItemProps) {
  const { ripples, flashes, addRipple } = useRipple();

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        addRipple(e);
        onSelectFriend(friend.id);
      }}
      className="bg-white border-2 border-black rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-[#6b5ce7] flex items-center justify-center text-white border-2 border-black">
        {friend.name.charAt(0)}
      </div>
      
      {/* Friend Info */}
      <div className="flex-1">
        <h3 className="text-sm">{friend.name}</h3>
        <p className="text-xs text-gray-500">Tap to chat</p>
      </div>

      {/* Message Icon */}
      <MessageCircle className="w-5 h-5 text-gray-400 relative z-10" />
      
      <Ripple ripples={ripples} flashes={flashes} />
    </motion.div>
  );
}
