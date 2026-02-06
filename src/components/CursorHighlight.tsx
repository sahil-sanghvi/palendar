import { useState, useEffect } from 'react';

export function CursorHighlight() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        className="fixed pointer-events-none z-[9999] cursor-ring"
        style={{
          left: position.x,
          top: position.y,
          width: '48px',
          height: '48px',
          marginLeft: '-24px',
          marginTop: '-24px',
          border: '3px solid rgba(59, 130, 246, 0.5)',
          borderRadius: '50%',
          transition: 'transform 0.1s ease-out',
        }}
      />
      
      {/* Click indicator */}
      {isClicking && (
        <div
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: position.x,
            top: position.y,
            width: '64px',
            height: '64px',
            marginLeft: '-32px',
            marginTop: '-32px',
            border: '4px solid rgba(59, 130, 246, 0.8)',
            borderRadius: '50%',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            animation: 'flash 300ms ease-out',
          }}
        />
      )}
    </>
  );
}
