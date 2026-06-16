import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const FadingVideo = ({ sources, interval = 8000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!sources || sources.length === 0) return;
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % sources.length);
    }, interval);
    return () => clearInterval(timer);
  }, [sources, interval]);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-black" style={{ zIndex: 0 }}>
      <AnimatePresence mode="wait">
        <motion.video
          key={sources[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onContextMenu={(e) => e.preventDefault()}
        >
          <source src={sources[index]} type="video/mp4" />
        </motion.video>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
    </div>
  );
};

export default FadingVideo;
