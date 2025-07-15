import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';

const App = () => {
  const [habits, setHabits] = useState([]);
  const [showQuote, setShowQuote] = useState(true);
  
  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);
  
  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);
  
  const addHabit = (newHabit) => {
    setHabits([...habits, newHabit]);
  };
  
  const completeHabit = (id) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        // Calculate progress
        const newProgress = habit.progress + (
          habit.frequency === 'daily' ? 100 : 
          habit.frequency === 'weekly' ? 14.28 : 3.33
        );
        
        // Check if habit is completed for this period
        const isCompleted = newProgress >= 100;
        
        return {
          ...habit,
          progress: isCompleted ? 0 : newProgress,
          streak: isCompleted ? habit.streak + 1 : habit.streak
        };
      }
      return habit;
    }));
  };
  
  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const quotes = [
    { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { text: "Habits are the compound interest of self-improvement.", author: "James Clear" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle" }
  ];
  
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-purple-100 text-indigo-900">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Habit Tracker
          </h1>
          <p className="text-indigo-700 text-lg">Transform your life one small step at a time</p>
        </motion.div>
        
        {showQuote && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-2xl shadow-xl text-white mb-12 relative"
          >
            <button 
              className="absolute top-3 right-3 text-white/80 hover:text-white"
              onClick={() => setShowQuote(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="max-w-2xl mx-auto text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-200 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p className="text-xl md:text-2xl font-medium italic mb-3">"{randomQuote.text}"</p>
              <p className="text-indigo-200">— {randomQuote.author}</p>
            </div>
          </motion.div>
        )}
        
        <HabitForm onSubmit={addHabit} />
        <HabitList 
          habits={habits} 
          onCompleteHabit={completeHabit} 
          onDeleteHabit={deleteHabit}
        />
      </div>
    </div>
  );
};

export default App;