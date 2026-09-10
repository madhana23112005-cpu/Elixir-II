import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
}

export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({ children, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -14;
    const rotateY = ((x - centerX) / centerX) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 0.2 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div style={{ perspective: '1000px' }} className="h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className={`relative h-full transition-shadow duration-300 ${className}`}
      >
        {/* Specular glare overlay */}
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200 z-20"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 215, 0, 0.25) 0%, transparent 60%)`,
            opacity: glare.opacity
          }}
        />
        <div style={{ transform: 'translateZ(20px)' }} className="h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
