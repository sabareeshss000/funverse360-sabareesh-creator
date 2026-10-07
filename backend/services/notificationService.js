import Notification from '../models/Notification.js';

let ioInstance = null;

export const setSocketIO = (io) => {
  ioInstance = io;
};

export const sendNotification = async ({ userId, title, message, type = 'SYSTEM', link = '' }) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      link
    });

    if (ioInstance) {
      // Emit to targeted user channel or broadcast
      ioInstance.emit(`notification:${userId}`, notification);
      ioInstance.emit('notification:all', notification);
    }

    return notification;
  } catch (error) {
    console.error('[NOTIFICATION ERROR]', error.message);
  }
};
