import { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Clock,
  User,
  Calendar,
  Phone,
  UserCheck,
  AlertTriangle,
} from "lucide-react";
import "../Notification/notification.css";
import { BASE_URL } from "../../config";

function Notification() {
  const [notificationData, setNotificationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock token - replace with your actual token logic
  const token = JSON.parse(
    localStorage.getItem("employeROyalmadeLogin") || "{}"
  )?.token;

  const parseAlertMessage = (message, index) => {
    const alertPattern =
      /⚠️ Alert: Lead '([^']+)' has status '([^']+)' on ([^.]+)\. Remark: (.+)/;
    const match = message.match(alertPattern);

    if (match) {
      const [, leadName, status, date, remark] = match;
      return {
        _id: `alert_${index}`,
        title: `Lead Follow-up Required`,
        description: `Lead '${leadName}' requires attention with status '${status}'. ${remark}`,
        type: getAlertType(status),
        timestamp: new Date(date).toISOString(),
        isRead: false,
        priority: getPriority(status),
        sender: "Lead Management System",
        leadName,
        status,
        remark,
        alertType: "lead_alert",
      };
    }

    // Fallback for other message formats
    return {
      _id: `notification_${index}`,
      title: "System Notification",
      description: message,
      type: "info",
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: "medium",
      sender: "System",
      alertType: "general",
    };
  };

  const getAlertType = (status) => {
    switch (status) {
      case "FOLLOW_UP":
        return "warning";
      case "INTERESTED":
        return "success";
      case "NOT_INTERESTED":
        return "error";
      case "CALLBACK":
        return "info";
      default:
        return "info";
    }
  };

  const getPriority = (status) => {
    switch (status) {
      case "FOLLOW_UP":
      case "CALLBACK":
        return "high";
      case "INTERESTED":
        return "medium";
      case "NOT_INTERESTED":
        return "low";
      default:
        return "medium";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "FOLLOW_UP":
        return "status-followup";
      case "INTERESTED":
        return "status-interested";
      case "NOT_INTERESTED":
        return "status-not-interested";
      case "CALLBACK":
        return "status-callback";
      default:
        return "status-default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "FOLLOW_UP":
        return <Phone className="status-icon" />;
      case "INTERESTED":
        return <UserCheck className="status-icon" />;
      case "NOT_INTERESTED":
        return <X className="status-icon" />;
      case "CALLBACK":
        return <Clock className="status-icon" />;
      default:
        return <Info className="status-icon" />;
    }
  };

  useEffect(() => {
    async function getAllNotifications() {
      setLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/lead/alerts`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(response.data);
        const rawMessages = response.data; // This is your array of strings

        const parsedNotifications = rawMessages.map((message, index) =>
          parseAlertMessage(message, index)
        );

        setNotificationData(parsedNotifications);
        setUnreadCount(parsedNotifications.filter((n) => !n.isRead).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotificationData([]);
      } finally {
        setLoading(false);
      }
    }

    getAllNotifications();
  }, [token]);

  const markAsRead = (id) => {
    setNotificationData((prev) =>
      prev.map((notification) =>
        notification._id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const deleteNotification = (id) => {
    setNotificationData((prev) =>
      prev.filter((notification) => notification._id !== id)
    );
    const notification = notificationData.find((n) => n._id === id);
    if (notification && !notification.isRead) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setNotificationData((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="notification-icon success" />;
      case "warning":
        return <AlertTriangle className="notification-icon warning" />;
      case "error":
        return <AlertCircle className="notification-icon error" />;
      case "info":
      default:
        return <Info className="notification-icon info" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredNotifications = notificationData.filter((notification) => {
    if (filter === "unread") return !notification.isRead;
    if (filter === "read") return notification.isRead;
    return true;
  });

  if (loading) {
    return (
      <div className="notification-container">
        <div className="notification-header">
          <div className="header-title">
            <Bell className="header-icon" />
            <h1>Lead Alerts</h1>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-container">
      <div className="notification-header">
        <div className="header-title">
          <div className="bell-container">
            <Bell className="header-icon" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </div>
          <div className="title-content">
            <h1>Lead Alerts</h1>
            <p className="subtitle">
              Stay updated with your lead activities and follow-ups
            </p>
          </div>
        </div>

        {notificationData.length > 0 && (
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {notificationData.length > 0 && (
        <div className="notification-filters">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({notificationData.length})
          </button>
          {/* <button
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === "read" ? "active" : ""}`}
            onClick={() => setFilter("read")}
          >
            Read ({notificationData.length - unreadCount})
          </button> */}
        </div>
      )}

      <div className="notification-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${
                !notification.isRead ? "unread" : ""
              } ${notification.priority} ${notification.alertType}`}
            >
              <div className="notification-content">
                <div className="notification-main">
                  <div className="notification-icon-wrapper">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="notification-details">
                    <div className="notification-title-row">
                      <h3 className="notification-title">
                        {notification.title}
                      </h3>

                      <div className="notification-meta">
                        <span className="notification-time">
                          <Clock className="time-icon" />
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>

                    {notification.alertType === "lead_alert" && (
                      <div className="lead-alert-details">
                        <div className="lead-info">
                          <div className="lead-name">
                            <User className="lead-icon" />
                            <span className="lead-name-text">
                              {notification.leadName}
                            </span>
                          </div>
                          <div
                            className={`lead-status ${getStatusColor(
                              notification.status
                            )}`}
                          >
                            {getStatusIcon(notification.status)}
                            <span>{notification.status.replace("_", " ")}</span>
                          </div>
                        </div>
                        <div className="remark-section">
                          <span className="remark-label">Remark:</span>
                          <span className="remark-text">
                            {notification.remark}
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="notification-description">
                      {notification.description}
                    </p>

                    <div className="notification-footer">
                      <div className="sender-info">
                        <User className="sender-icon" />
                        <span className="sender-name">
                          {notification.sender}
                        </span>
                      </div>
                      <div className="notification-date">
                        <Calendar className="date-icon" />
                        <span>
                          {new Date(
                            notification.timestamp
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      className="action-btn mark-read"
                      onClick={() => markAsRead(notification._id)}
                      title="Mark as read"
                    >
                      <CheckCircle />
                    </button>
                  )}
                  <button
                    className="action-btn delete"
                    onClick={() => deleteNotification(notification._id)}
                    title="Delete notification"
                  >
                    <X />
                  </button>
                </div>
              </div>

              {!notification.isRead && <div className="unread-indicator"></div>}
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon-container">
              <Bell className="empty-icon" />
            </div>
            <h3>No lead alerts found</h3>
            <p>
              {filter === "all"
                ? "You're all caught up! No lead alerts to show."
                : `No ${filter} lead alerts at the moment.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notification;


