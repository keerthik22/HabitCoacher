import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Anonymous" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "Your habits will determine your future.", author: "Jack Canfield" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" }
];

const MotivationalQuote = forwardRef((props, ref) => {
  const [quote, setQuote] = useState(quotes[0]);
  const [fadeIn, setFadeIn] = useState(true);

  // Change quote daily or when component mounts
  useEffect(() => {
    // Get today's date to ensure the same quote shows all day
    const today = new Date().toDateString();
    
    // Use the date string to generate a consistent index for today
    const charSum = today.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const todayIndex = charSum % quotes.length;
    
    setQuote(quotes[todayIndex]);
  }, []);

  // Manual quote refresh function
  const refreshQuote = () => {
    setFadeIn(false);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setFadeIn(true);
    }, 500);
  };

  // Expose refreshQuote method to parent component through ref
  useImperativeHandle(ref, () => ({
    refreshQuote
  }));

  return (
    <motion.div 
      className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg shadow-lg text-white mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeIn ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-2"
      >
        <p className="text-lg font-medium italic">
          "{quote.text}"
        </p>
        <p className="text-sm text-right">— {quote.author}</p>
      </motion.div>
      
      <button 
        onClick={refreshQuote}
        className="mt-4 text-xs bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full transition-all"
      >
        New Quote
      </button>
    </motion.div>
  );
});
export default MotivationalQuote;