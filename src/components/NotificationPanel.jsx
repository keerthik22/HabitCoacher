import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import notificationService from '../services/NotificationService';

const NotificationPanel = ({ habits }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('09:00');
  const [notificationStatus, setNotificationStatus] = useState('idle'); // idle, requesting, granted, denied
  const [scheduledNotifications, setScheduledNotifications] = useState({});
  const [selectedHabitId, setSelectedHabitId] = useState('all'); // 'all' or a specific habit id

  // Check if notifications are already scheduled
  useEffect(() => {
    const notifications = notificationService.getScheduledNotifications();
    setScheduledNotifications(notifications);
    
    // If any notifications are scheduled, set enabled to true
    if (Object.keys(notifications).length > 0) {
      setEnabled(true);
      // Use the time from the first notification as the default time
      const firstNotification = Object.values(notifications)[0];
      if (firstNotification && firstNotification.time) {
        setTime(firstNotification.time);
      }
    }
  }, []);

  // Request notification permission when enabling
  const handleEnableToggle = async () => {
    if (!enabled) {
      setNotificationStatus('requesting');
      const permitted = await notificationService.init();
      if (permitted) {
        setNotificationStatus('granted');
        setEnabled(true);
        scheduleAllNotifications();
      } else {
        setNotificationStatus('denied');
        setEnabled(false);
      }
    } else {
      // Disable all notifications
      cancelAllNotifications();
      setEnabled(false);
    }
  };

  // Schedule notifications for selected habits
  const scheduleAllNotifications = () => {
    if (enabled && habits.length > 0) {
      // Cancel any existing notifications first
      cancelAllNotifications();
      
      // Schedule new notifications for selected habits
      const newScheduledNotifications = {};
      
      if (selectedHabitId === 'all') {
        // Schedule for all habits
        habits.forEach(habit => {
          const id = notificationService.scheduleHabitReminder(habit, time);
          if (id) {
            newScheduledNotifications[habit.id] = notificationService.getScheduledNotifications()[habit.id];
          }
        });
      } else {
        // Schedule for the selected habit only
        const selectedHabit = habits.find(habit => habit.id === selectedHabitId);
        if (selectedHabit) {
          const id = notificationService.scheduleHabitReminder(selectedHabit, time);
          if (id) {
            newScheduledNotifications[selectedHabit.id] = notificationService.getScheduledNotifications()[selectedHabit.id];
          }
        }
      }
      
      setScheduledNotifications(newScheduledNotifications);
    }
  };

  // Cancel all scheduled notifications
  const cancelAllNotifications = () => {
    Object.keys(scheduledNotifications).forEach(habitId => {
      notificationService.cancelScheduledNotification(habitId);
    });
    setScheduledNotifications({});
  };

  // Update notifications when time changes
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (enabled) {
      // Re-schedule all notifications with the new time
      cancelAllNotifications();
      setTimeout(() => scheduleAllNotifications(), 0); // Use setTimeout to ensure state is updated
    }
  };
  
  // Handle habit selection change
  const handleHabitChange = (e) => {
    const habitId = e.target.value;
    setSelectedHabitId(habitId);
    if (enabled) {
      // Re-schedule notifications with the new habit selection
      cancelAllNotifications();
      setTimeout(() => scheduleAllNotifications(), 0); // Use setTimeout to ensure state is updated
    }
  };

  // Toggle panel open/closed
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Notification Bell Button */}
      <motion.button
        className="p-3 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePanel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      </motion.button>

      {/* Notification Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-14 left-0 bg-white rounded-xl shadow-xl p-6 w-80"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Notification Settings</h3>
              <button
                onClick={togglePanel}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="enable-notifications" className="text-base font-medium text-gray-800">
                  Enable Reminders
                </label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    id="enable-notifications"
                    checked={enabled}
                    onChange={handleEnableToggle}
                    className="toggle-checkbox absolute block w-7 h-7 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    style={{
                      right: enabled ? '0' : '5px',
                      transition: 'right 0.3s',
                      borderColor: enabled ? '#4F46E5' : '#D1D5DB',
                    }}
                  />
                  <label
                    htmlFor="enable-notifications"
                    className="toggle-label block overflow-hidden h-7 rounded-full cursor-pointer"
                    style={{
                      backgroundColor: enabled ? '#4F46E5' : '#D1D5DB',
                      transition: 'background-color 0.3s',
                    }}
                  ></label>
                </div>
              </div>

              {notificationStatus === 'requesting' && (
                <p className="text-sm text-blue-500 mt-2 bg-blue-50 p-2 rounded">Requesting permission...</p>
              )}
              {notificationStatus === 'denied' && (
                <p className="text-sm text-red-500 mt-2 bg-red-50 p-2 rounded">
                  Notification permission denied. Please enable notifications in your browser settings.
                </p>
              )}
            </div>

            {enabled && (
              <>
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <label htmlFor="habit-select" className="block text-base font-medium text-gray-800 mb-2">
                    Set Reminder for which habit
                  </label>
                  <select
                    id="habit-select"
                    value={selectedHabitId}
                    onChange={handleHabitChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  >
                    <option value="all">All Habits</option>
                    {habits.map(habit => (
                      <option key={habit.id} value={habit.id}>{habit.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <label htmlFor="notification-time" className="block text-base font-medium text-gray-800 mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    id="notification-time"
                    value={time}
                    onChange={handleTimeChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  />
                  <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                    {selectedHabitId === 'all' 
                      ? "All habits will be reminded at this time based on their frequency." 
                      : "Selected habit will be reminded at this time based on its frequency."}
                  </p>
                </div>
              </>
            )}

            {enabled && Object.keys(scheduledNotifications).length > 0 && (
              <div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {Object.keys(scheduledNotifications).length} habit reminder{Object.keys(scheduledNotifications).length !== 1 ? 's' : ''} scheduled!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;