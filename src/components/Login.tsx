import { useState } from 'react';
import { HelpCircle, User, Facebook } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useRipple, Ripple } from './Ripple';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { ripples: helpRipples, addRipple: addHelpRipple } = useRipple();
  const { ripples: userRipples, addRipple: addUserRipple } = useRipple();
  const { ripples: loginRipples, addRipple: addLoginRipple } = useRipple();
  const { ripples: googleRipples, addRipple: addGoogleRipple } = useRipple();
  const { ripples: appleRipples, addRipple: addAppleRipple } = useRipple();
  const { ripples: facebookRipples, addRipple: addFacebookRipple } = useRipple();

  const handleLogin = () => {
    if (username === 'demo@uvic.ca' && password === 'SENG310isFun!!') {
      setError('');
      setIsLoggingIn(true);
      // Show loading state briefly before logging in
      setTimeout(() => {
        onLogin();
      }, 500);
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="relative h-full bg-[#f5f1e8] flex items-center justify-center p-6">
      <div className="w-full">
        {/* Header with help and profile icons */}
        <div className="flex justify-between mb-6">
          <motion.button 
            whileTap={{ scale: 0.85 }}
            onClick={addHelpRipple}
            className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
          >
            <HelpCircle className="w-5 h-5 relative z-10" />
            <Ripple ripples={helpRipples.ripples} flashes={helpRipples.flashes} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.85 }}
            onClick={addUserRipple}
            className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center active:bg-gray-100 relative overflow-hidden"
          >
            <User className="w-5 h-5 relative z-10" />
            <Ripple ripples={userRipples.ripples} flashes={userRipples.flashes} />
          </motion.button>
        </div>

        {/* Main login card */}
        <div className="bg-white border-2 border-black rounded-lg p-6 space-y-5">
          <div className="text-center space-y-2">
            <h1 className="tracking-wider">Welcome to</h1>
            <h2 className="tracking-wider">PALENDAR</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1">Email Address</label>
              <Input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border-2 border-black rounded-lg bg-white"
                placeholder="demo@uvic.ca"
              />
            </div>

            <div>
              <label className="block mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full border-2 border-black rounded-lg bg-white"
                placeholder="••••••••••"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <motion.div whileTap={{ scale: 0.95 }} className="relative">
              <Button
                onClick={(e) => {
                  addLoginRipple(e);
                  handleLogin();
                }}
                disabled={isLoggingIn}
                className="w-full h-12 border-2 border-black rounded-lg bg-white active:bg-gray-100 text-black relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <div className="flex items-center justify-center gap-2 relative z-10">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Log-In</span>
                )}
                <Ripple ripples={loginRipples.ripples} flashes={loginRipples.flashes} color="bg-blue-400/40" />
              </Button>
            </motion.div>
          </div>

          <div className="text-center">
            <p className="text-sm">
              Not a user?{' '}
              <button className="underline hover:no-underline">
                Sign-up
              </button>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-center text-sm">Sign-in via</p>
            <div className="flex justify-center gap-3">
              <motion.button 
                whileTap={{ scale: 0.85 }}
                onClick={addGoogleRipple}
                className="w-12 h-12 rounded-lg border-2 border-black bg-white active:bg-gray-100 flex items-center justify-center relative overflow-hidden"
              >
                <span className="text-lg relative z-10">G</span>
                <Ripple ripples={googleRipples.ripples} flashes={googleRipples.flashes} />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.85 }}
                onClick={addAppleRipple}
                className="w-12 h-12 rounded-lg border-2 border-black bg-white active:bg-gray-100 flex items-center justify-center relative overflow-hidden"
              >
                <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <Ripple ripples={appleRipples.ripples} flashes={appleRipples.flashes} />
              </motion.button>
              <motion.button 
                whileTap={{ scale: 0.85 }}
                onClick={addFacebookRipple}
                className="w-12 h-12 rounded-lg border-2 border-black bg-white active:bg-gray-100 flex items-center justify-center relative overflow-hidden"
              >
                <Facebook className="w-6 h-6 relative z-10" />
                <Ripple ripples={facebookRipples.ripples} flashes={facebookRipples.flashes} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
