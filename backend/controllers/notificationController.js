const Notification = require('../models/Notification');

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};

// Get all notifications (for admin)
const getAllNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read, type, priority } = req.query;
    
    // Build filter object
    const filter = {};
    if (read !== undefined) filter.read = read === 'true';
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    
    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('customer.id', 'name email')
      .populate('trip.id', 'title destination');
    
    const total = await Notification.countDocuments(filter);
    const unreadCount = await Notification.countDocuments({ read: false });
    
    res.json({
      success: true,
      data: notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(
      id,
      { 
        read: true, 
        readAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification',
      error: error.message
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { read: false },
      { 
        read: true, 
        readAt: new Date(),
        updatedAt: new Date()
      }
    );
    
    res.json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications',
      error: error.message
    });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findByIdAndDelete(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Delete all notifications
const deleteAllNotifications = async (req, res) => {
  try {
    const result = await Notification.deleteMany({});
    
    res.json({
      success: true,
      message: `${result.deletedCount} notifications deleted`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notifications',
      error: error.message
    });
  }
};

// Get notification statistics
const getNotificationStats = async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } },
          byType: {
            $push: {
              type: '$type',
              priority: '$priority'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          unread: 1,
          read: { $subtract: ['$total', '$unread'] },
          byType: 1
        }
      }
    ]);
    
    // Count by type
    const typeStats = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } }
        }
      }
    ]);
    
    // Count by priority
    const priorityStats = await Notification.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          unread: { $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] } }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: stats[0] || { total: 0, unread: 0, read: 0 },
        byType: typeStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notification statistics',
      error: error.message
    });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats
};