import { motion, AnimatePresence } from 'framer-motion';
import HabitCard from './HabitCard';

const HabitList = ({ habits, onCompleteHabit, onDeleteHabit }) => {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">Your Journey</h2>
      
      {habits.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-indigo-50 rounded-2xl shadow-md p-12 text-center border-2 border-dashed border-indigo-200"
        >
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <p className="text-indigo-700 font-medium">You haven't created any habits yet.</p>
          <p className="text-indigo-500 text-sm mt-2">Add your first habit above to begin your journey!</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {habits.map(habit => (
              <motion.div 
                key={habit.id}
                layout
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <HabitCard 
                  habit={habit} 
                  onComplete={onCompleteHabit} 
                  onDelete={onDeleteHabit} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default HabitList;