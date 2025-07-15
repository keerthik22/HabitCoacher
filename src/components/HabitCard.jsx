import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const HabitCard = ({ habit, onComplete, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFilling, setIsFilling] = useState(false);
  const [fillProgress, setFillProgress] = useState(habit.progress);
  
  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    tap: { scale: 0.98 }
  };

  const progressVariants = {
    initial: { width: '0%' },
    animate: { width: `${isFilling ? fillProgress : habit.progress}%` }
  };
  
  // Update fillProgress when habit.progress changes
  useEffect(() => {
    if (!isFilling) {
      setFillProgress(habit.progress);
    }
  }, [habit.progress, isFilling]);

  // Handle completion with animation
  const handleComplete = async () => {
    setIsFilling(true);
    
    // Calculate target progress based on frequency
    const increment = habit.frequency === 'daily' ? 100 : 
                      habit.frequency === 'weekly' ? 14.28 : 3.33;
    const targetProgress = Math.min(habit.progress + increment, 100);
    
    // Animate to target
    const animationDuration = 1000; // 1 second
    const startTime = Date.now();
    const startProgress = habit.progress;
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const currentProgress = startProgress + (targetProgress - startProgress) * progress;
      
      setFillProgress(currentProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        // Animation complete
        setTimeout(() => {
          onComplete(habit.id);
          setIsFilling(false);
        }, 300); // Small delay before resetting
      }
    };
    
    requestAnimationFrame(animateProgress);
  };

  return (
    <motion.div 
      className="relative overflow-hidden w-full max-w-md bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-100"
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="flex justify-between items-start mb-3 flex-wrap gap-1 relative">
        <motion.div 
          className="absolute -top-2 -left-2 w-10 h-10 bg-purple-600 text-white flex items-center justify-center rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="font-bold">{habit.streak}</span>
        </motion.div>
        <h3 className="text-lg font-semibold text-indigo-900 break-words pl-10">{habit.name}</h3>
      </div>
      
      <p className="text-sm text-indigo-700 mb-4 break-words">{habit.description}</p>
      
      {/* Progress bar */}
      <div className="h-3 bg-indigo-100 rounded-full overflow-hidden mb-4">
        <motion.div 
          className={`h-full ${isFilling ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-purple-500'}`}
          variants={progressVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: isFilling ? 0.05 : 0.5 }}
        />
      </div>
      
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div className="text-xs px-3 py-1 rounded-full bg-indigo-200 text-indigo-800 font-medium">
          {habit.frequency}
        </div>
        
        <div className="flex space-x-2">
          {/* Complete button */}
          <motion.button
            className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            disabled={isFilling}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.button>
          
          {/* Delete button */}
          <motion.button
            className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(habit.id)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;