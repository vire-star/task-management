import { Notification } from "../models/notification.model.js";

// ✅ Mark SINGLE notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const  notificationId  = req.params.id;
    const userId = req.id;

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: notificationId,
        recipientId: userId  // ✅ Only own notifications
      },
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found or not yours"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification
    });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Mark ALL notifications as read (KEY FUNCTION!)
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.id;

    // ✅ Update ALL notifications for THIS user only
    const result = await Notification.updateMany(
      { 
        recipientId: userId,  // ✅ Specific user only!
        isRead: false         // Unread ones only
      },
      { 
        isRead: true,
        readAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      
    });
  } catch (error) {
    console.error("Mark all read error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Get notifications - DEFAULT UNREAD ONLY
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;
    const { showRead = 'false', limit = 20, page = 1 } = req.query;  // ✅ Default false

    // ✅ ALWAYS filter by recipientId + DEFAULT unread
    const filter = { 
      recipientId: userId,
      isRead: showRead === 'true' ? undefined : false  // ✅ Default: only unread!
    };

    // Remove undefined keys
    Object.keys(filter).forEach(key => filter[key] === undefined && delete filter[key]);

    const notifications = await Notification
      .find(filter)
      .populate('actorId', 'name avatarUrl email')
      .populate('workshopId', 'name')
      .sort({ createdAt: -1 });

    // ✅ Unread count
    const unreadCount = await Notification.countDocuments({
      recipientId: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      showing: showRead === 'true' ? 'all' : 'unread'  // ✅ Debug info
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};
