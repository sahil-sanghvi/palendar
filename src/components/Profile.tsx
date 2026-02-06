import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { User, Mail, Calendar, Users, Edit } from 'lucide-react';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';

interface Group {
  name: string;
  type: string;
  description: string;
}

interface Event {
  id: string;
  groupName: string;
  name: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

interface Friend {
  id: string;
  name: string;
}

interface ProfileProps {
  groups: Group[];
  events: Event[];
  friends: Friend[];
  onNavigate: (page: 'home' | 'groups' | 'create-group' | 'friends') => void;
  onLogout: () => void;
}

export function Profile({ groups, events, friends, onNavigate, onLogout }: ProfileProps) {
  const { ripples: editRipples, addRipple: addEditRipple } = useRipple();

  // Calculate stats
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today;
  }).length;

  return (
    <div className="relative h-full flex flex-col bg-[#f5f1e8]">
      <Header onLogout={onLogout} />
      
      <div className="px-4 py-3 bg-white border-b-2 border-black">
        <h2>Your Profile</h2>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-6">
        {/* Profile Header */}
        <div className="bg-white border-2 border-black rounded-lg p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-black">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="mb-1">Demo User</h3>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>demo@uvic.ca</span>
                </div>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={addEditRipple}
              className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
            >
              <Edit className="w-4 h-4 relative z-10" />
              <Ripple ripples={editRipples.ripples} flashes={editRipples.flashes} />
            </motion.button>
          </div>

          {/* Bio */}
          <div className="pt-4 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600">
              Student at University of Victoria • SENG 310 • Group scheduling enthusiast
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white border-2 border-black rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Groups</span>
            </div>
            <p className="text-2xl">{groups.length}</p>
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Events</span>
            </div>
            <p className="text-2xl">{upcomingEvents}</p>
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Friends</span>
            </div>
            <p className="text-2xl">{friends.length}</p>
          </div>

          <div className="bg-white border-2 border-black rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📊</span>
              <span className="text-sm text-gray-600">Active</span>
            </div>
            <p className="text-2xl">{events.length}</p>
            <p className="text-xs text-gray-500">Total Events</p>
          </div>
        </div>

        {/* Groups List */}
        <div className="mb-4">
          <h3 className="text-sm text-gray-600 mb-3">Your Groups</h3>
          {groups.length === 0 ? (
            <div className="bg-white border-2 border-black rounded-lg p-4 text-center text-gray-500 text-sm">
              No groups yet. Create or join a group to get started!
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map((group, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-black rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm">{group.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{group.type}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-300">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="text-sm text-gray-600 mb-3">Recent Activity</h3>
          <div className="space-y-2">
            <div className="bg-white border-2 border-black rounded-lg p-3">
              <p className="text-sm mb-1">🎉 Joined PALENDAR</p>
              <p className="text-xs text-gray-500">Welcome to group scheduling!</p>
            </div>
            {groups.length > 0 && (
              <div className="bg-white border-2 border-black rounded-lg p-3">
                <p className="text-sm mb-1">👥 Joined {groups[0].name}</p>
                <p className="text-xs text-gray-500">Started collaborating with your group</p>
              </div>
            )}
            {friends.length > 0 && (
              <div className="bg-white border-2 border-black rounded-lg p-3">
                <p className="text-sm mb-1">✨ Connected with {friends.length} friends</p>
                <p className="text-xs text-gray-500">Building your network</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav currentPage="home" onNavigate={onNavigate} />
    </div>
  );
}
