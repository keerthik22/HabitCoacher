/**
 * NotificationService.js
 * A service to handle browser notifications and scheduled reminders for habits
 */

class NotificationService {
  constructor() {
    this.permission = null;
    this.supported = 'Notification' in window;
    this.scheduledNotifications = {};
  }

  /**
   * Initialize the notification service and request permission
   * @returns {Promise<boolean>} Whether notifications are permitted
   */
  async init() {
    if (!this.supported) {
      console.warn('Browser notifications are not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      return true;
    } else if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        this.permission = permission;
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    
    return false;
  }

  /**
   * Send a browser notification
   * @param {string} title - The notification title
   * @param {Object} options - Notification options
   * @returns {Notification|null} The notification object or null if not supported/permitted
   */
  sendNotification(title, options = {}) {
    if (!this.supported || this.permission !== 'granted') {
      return null;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      body: '',
      requireInteraction: false,
      silent: false
    };

    const notification = new Notification(title, { ...defaultOptions, ...options });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
      if (options.onClick) options.onClick();
    };

    return notification;
  }

  /**
   * Schedule a notification for a habit
   * @param {Object} habit - The habit object
   * @param {string} time - Time to send notification (HH:MM format)
   * @returns {string|null} The notification ID or null if scheduling failed
   */
  scheduleHabitReminder(habit, time) {
    if (!this.supported || this.permission !== 'granted') {
      return null;
    }

    // Clear any existing notification for this habit
    if (this.scheduledNotifications[habit.id]) {
      this.cancelScheduledNotification(habit.id);
    }

    const notificationId = `habit-${habit.id}`;
    
    // Parse the time string
    const [hours, minutes] = time.split(':').map(Number);
    
    // Calculate when to send the notification
    const scheduleTime = this._getNextScheduleTime(habit.frequency, hours, minutes);
    
    // Calculate exact milliseconds until the notification should trigger
    const timeUntilNotification = scheduleTime.getTime() - Date.now();
    
    // Only schedule if the time is in the future
    if (timeUntilNotification <= 0) {
      console.warn('Attempted to schedule notification in the past');
      // Recalculate for next valid occurrence
      const nextScheduleTime = this._getNextScheduleTime(habit.frequency, hours, minutes, true);
      return this.scheduleHabitReminder(habit, time);
    }
    
    // Store the timeout ID so we can cancel it later if needed
    const timeoutId = setTimeout(() => {
      this.sendNotification(`Reminder: ${habit.name}`, {
        body: habit.description || 'Time to work on your habit!',
        requireInteraction: true,
        onClick: () => {
          // Re-schedule for next occurrence after clicking
          this.scheduleHabitReminder(habit, time);
        }
      });
      
      // Re-schedule for next occurrence
      this.scheduleHabitReminder(habit, time);
    }, timeUntilNotification);
    
    this.scheduledNotifications[habit.id] = {
      id: notificationId,
      timeoutId,
      habit,
      time,
      nextSchedule: scheduleTime
    };
    
    return notificationId;
  }

  /**
   * Cancel a scheduled notification
   * @param {string} habitId - The habit ID
   */
  cancelScheduledNotification(habitId) {
    const notification = this.scheduledNotifications[habitId];
    if (notification) {
      clearTimeout(notification.timeoutId);
      delete this.scheduledNotifications[habitId];
    }
  }

  /**
   * Get all scheduled notifications
   * @returns {Object} The scheduled notifications
   */
  getScheduledNotifications() {
    return this.scheduledNotifications;
  }

  /**
   * Calculate the next time to schedule a notification based on habit frequency
   * @param {string} frequency - The habit frequency (daily, weekly, monthly)
   * @param {number} hours - Hours for the notification
   * @param {number} minutes - Minutes for the notification
   * @returns {Date} The next schedule time
   * @private
   */
  _getNextScheduleTime(frequency, hours, minutes) {
    const now = new Date();
    const scheduleTime = new Date();
    
    // Set the time
    scheduleTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for the next occurrence
    if (scheduleTime <= now) {
      switch (frequency) {
        case 'daily':
          // Schedule for tomorrow
          scheduleTime.setDate(scheduleTime.getDate() + 1);
          break;
          
        case 'weekly':
          // Schedule for next week
          scheduleTime.setDate(scheduleTime.getDate() + 7);
          break;
          
        case 'monthly':
          // Schedule for next month
          scheduleTime.setMonth(scheduleTime.getMonth() + 1);
          break;
          
        default:
          // Default to tomorrow
          scheduleTime.setDate(scheduleTime.getDate() + 1);
      }
    }
    
    return scheduleTime;
  }
}

// Create a singleton instance
const notificationService = new NotificationService();

export default notificationService;