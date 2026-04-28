import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LiquidGlass() {
  const [targetRect, setTargetRect] = useState(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    // Detect if this is a touch device so we can disable the sticky hover effect
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    let currentTarget = null;
    let timeout;

    const updateRect = () => {
      if (!currentTarget) return;
      const rect = currentTarget.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(currentTarget);
      setTargetRect({
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top,
        borderRadius: computedStyle.borderRadius || '14px',
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('button, .btn, .filter-chip, .team-option, .nav-btn, a');
      if (target) {
        clearTimeout(timeout);
        currentTarget = target;
        updateRect();
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('button, .btn, .filter-chip, .team-option, .nav-btn, a');
      if (target) {
        timeout = setTimeout(() => {
          currentTarget = null;
          setTargetRect(null);
          setIsPressed(false);
        }, 50); 
      }
    };

    const handleMouseDown = (e) => {
      if (currentTarget && currentTarget.contains(e.target)) {
        setIsPressed(true);
      }
    };

    const handleMouseUp = () => {
      setIsPressed(false);
    };

    // When the window loses focus (like clicking Connect Wallet to open the Freighter extension), hide the glass to prevent sticking
    const handleWindowBlur = () => {
      currentTarget = null;
      setTargetRect(null);
      setIsPressed(false);
    };

    window.addEventListener('scroll', updateRect, true);
    window.addEventListener('resize', updateRect);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <AnimatePresence>
      {targetRect && (
        <motion.div
          initial={{
            opacity: 0,
            x: targetRect.x - 4,
            y: targetRect.y - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: targetRect.borderRadius,
            scale: 0.98,
          }}
          animate={{
            opacity: 1,
            x: targetRect.x - 4,
            y: targetRect.y - 4,
            width: targetRect.width + 8,
            height: targetRect.height + 8,
            borderRadius: targetRect.borderRadius,
            scale: isPressed ? 0.92 : 1, // Squeeze animation on click
          }}
          exit={{ 
            opacity: 0,
            scale: 0.98 
          }}
          transition={{
            opacity: { duration: 0.15 },
            scale: { type: 'spring', stiffness: 600, damping: 25, mass: 0.5 },
            default: { duration: 0 } // Disable 'following' animation so it snaps instantly
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9990,
            pointerEvents: 'none',
            // True clear glass - zero blur, just light refraction
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'brightness(1.15) saturate(1.2)',
            WebkitBackdropFilter: 'brightness(1.15) saturate(1.2)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: `
              inset 0 1.5px 1px rgba(255, 255, 255, 0.6),
              inset 0 -1px 1px rgba(255, 255, 255, 0.1),
              0 8px 24px rgba(0, 0, 0, 0.15),
              0 2px 6px rgba(0, 0, 0, 0.1)
            `,
            willChange: 'transform, opacity',
          }}
        >
          {/* Top edge specular highlight */}
          <div
            style={{
              position: 'absolute',
              top: '1px', left: '6%', right: '6%',
              height: '35%',
              borderRadius: 'inherit',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 100%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
