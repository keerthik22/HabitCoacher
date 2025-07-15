import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import notificationService from '../services/NotificationService';

const NotificationSettings = ({ habit, onClose }) => {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('09:00');
  const [notificationStatus, setNotificationStatus] = useState('idle'); 
  const [notificationId, setNotificationId] = useState(null);

  // Check if notification is already scheduled for this habit
  useEffect(() => {
    const notifications = notificationService.getScheduledNotifications();
    if (notifications[habit.id]) {
      setEnabled(true);
      setTime(notifications[habit.id].time);
      setNotificationId(notifications[habit.id].id);
    }
  }, [habit.id]);

  // Request notification permission when enabling
  const handleEnableToggle = async () => {
    if (!enabled) {
      setNotificationStatus('requesting');
      const permitted = await notificationService.init();
      if (permitted) {
        setNotificationStatus('granted');
        setEnabled(true);
        scheduleNotification();
      } else {
        setNotificationStatus('denied');
        setEnabled(false);
      }
    } else {
      // Disable notifications
      notificationService.cancelScheduledNotification(habit.id);
      setEnabled(false);
      setNotificationId(null);
    }
  };

  // Schedule notification with current settings
  const scheduleNotification = () => {
    if (enabled) {
      const id = notificationService.scheduleHabitReminder(habit, time);
      setNotificationId(id);
    }
  };

  // Update notification when time changes
  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setTime(newTime);
    if (enabled) {
      notificationService.cancelScheduledNotification(habit.id);
      notificationService.scheduleHabitReminder(habit, newTime);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notification Settings</h3>
        <button
          onClick={onClose}
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
            You'll receive a reminder at this time based on your habit's frequency ({habit.frequency}).
          </p>
        </div>
      )}

      {enabled && notificationId && (
        <div className="text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Reminder scheduled! Next notification will be sent according to your habit's {habit.frequency} frequency.
        </div>
      )}
    </motion.div>
  );
};

export default NotificationSettings;