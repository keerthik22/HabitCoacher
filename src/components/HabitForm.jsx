import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HabitForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter a habit name');
      return;
    }
    onSubmit({
      ...formData,
      id: Date.now(),
      progress: 0,
      streak: 0,
      createdAt: new Date().toISOString(),
    });
    setFormData({ name: '', description: '', frequency: 'daily' });
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-xl p-8 mb-8 border border-indigo-100"
    >
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">Add New Habit</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-indigo-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="What would you like to build?"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-indigo-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Why is this habit important to you?"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-indigo-700 mb-2">
              How Often?
            </label>
            <div className="flex gap-3">
              {['daily', 'weekly', 'monthly'].map((freq) => (
                <label key={freq} className="flex-1">
                  <input
                    type="radio"
                    name="frequency"
                    value={freq}
                    checked={formData.frequency === freq}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-full text-center py-3 px-2 rounded-xl cursor-pointer transition-all ${
                    formData.frequency === freq 
                      ? 'bg-purple-600 text-white font-medium shadow-md' 
                      : 'bg-white border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                  }`}>
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-pink-600 text-sm font-medium bg-pink-50 p-3 rounded-lg border border-pink-200"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Habit
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default HabitForm;