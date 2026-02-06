import { useState, useEffect } from 'react';

interface RippleType {
  x: number;
  y: number;
  id: number;
}

interface FlashType {
  id: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleType[]>([]);
  const [flashes, setFlashes] = useState<FlashType[]>([]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    const newFlash = {
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);
    setFlashes((prev) => [...prev, newFlash]);
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  useEffect(() => {
    if (flashes.length > 0) {
      const timer = setTimeout(() => {
        setFlashes((prev) => prev.slice(1));
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [flashes]);

  return { ripples, flashes, addRipple };
}

interface RippleProps {
  ripples?: RippleType[];
  flashes?: FlashType[];
  color?: string;
}

export function Ripple({ ripples = [], flashes = [], color = 'bg-black/30' }: RippleProps) {
  return (
    <>
      {/* Flash effect */}
      <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
        {flashes.map((flash) => (
          <span
            key={flash.id}
            className="absolute inset-0 bg-white/40 rounded-[inherit] animate-flash"
          />
        ))}
      </span>
      
      {/* Ripple effect */}
      <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className={`absolute ${color} rounded-full animate-ripple border-2 border-black/10`}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 0,
              height: 0,
            }}
          />
        ))}
      </span>
    </>
  );
}
