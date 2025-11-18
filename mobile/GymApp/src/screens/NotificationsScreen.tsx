import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

interface Notification {
  id: string;
  type: 'class' | 'payment' | 'membership' | 'attendance' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

const NotificationsScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock data for fallback
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'class',
      title: 'Lớp học sắp bắt đầu',
      message: 'Lớp "Yoga cơ bản" sẽ bắt đầu vào 14:00 hôm nay. Đừng quên điểm danh!',
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'payment',
      title: 'Thanh toán thành công',
      message: 'Đơn hàng #12345 đã được thanh toán thành công. Cảm ơn bạn!',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      type: 'membership',
      title: 'Thẻ thành viên sắp hết hạn',
      message: 'Thẻ thành viên của bạn sẽ hết hạn vào ngày 20/11/2025. Gia hạn ngay!',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '4',
      type: 'attendance',
      title: 'Điểm danh thành công',
      message: 'Bạn đã điểm danh buổi học "Boxing nâng cao" - Buổi 5',
      read: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '5',
      type: 'system',
      title: 'Chào mừng bạn đến với Gym App',
      message: 'Khám phá các lớp học và dịch vụ tuyệt vời của chúng tôi!',
      read: true,
      createdAt: new Date(Date.now() - 604800000).toISOString(),
    },
  ];

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const userId = (user as any)?._id || (user as any)?.id;
      
      if (!userId) {
        setNotifications(mockNotifications);
        setLoading(false);
        return;
      }

      // Fetch real notifications from API
      const response = await apiService.get(`/notifications/user/${userId}?filter=${filter}`);
      const data = response as any;
      
      if (data.notifications) {
        setNotifications(data.notifications.map((notif: any) => ({
          id: notif._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          read: notif.read,
          createdAt: notif.createdAt,
          data: notif.data,
        })));
        setUnreadCount(data.unreadCount || 0);
      } else {
        // Fallback to mock data
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Fallback to mock data on error
      setNotifications(mockNotifications);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.patch(`/notifications/${id}/read`, {});
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
      // Update UI anyway
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userId = (user as any)?._id || (user as any)?.id;
      if (userId) {
        await apiService.patch(`/notifications/user/${userId}/read-all`, {});
      }
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
      // Update UI anyway
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    handleMarkAsRead(notification.id);

    // Navigate based on notification type
    switch (notification.type) {
      case 'class':
        navigation.navigate('MyClasses');
        break;
      case 'payment':
        navigation.navigate('History');
        break;
      case 'membership':
        navigation.navigate('Membership');
        break;
      case 'attendance':
        navigation.navigate('History');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'class':
        return '💪';
      case 'payment':
        return '💳';
      case 'membership':
        return '🎫';
      case 'attendance':
        return '✓';
      case 'system':
        return '📢';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'class':
        return '#007AFF';
      case 'payment':
        return '#4CAF50';
      case 'membership':
        return '#FF9500';
      case 'attendance':
        return '#34C759';
      case 'system':
        return '#8E8E93';
      default:
        return '#999';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    return true;
  });

  const displayUnreadCount = unreadCount || notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải thông báo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Thông báo</Text>
          {displayUnreadCount > 0 && (
            <Text style={styles.headerSubtitle}>{displayUnreadCount} chưa đọc</Text>
          )}
        </View>
        {displayUnreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={handleMarkAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Đọc tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, styles.filterTabLeft, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            Tất cả ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, styles.filterTabRight, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
            Chưa đọc ({displayUnreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>
              {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
            </Text>
          </View>
        ) : (
          <>
            {filteredNotifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.notificationCardUnread,
              ]}
              onPress={() => handleNotificationPress(notification)}
              activeOpacity={0.7}
            >
              <View style={styles.notificationIconContainer}>
                <View
                  style={[
                    styles.notificationIcon,
                    { backgroundColor: getNotificationColor(notification.type) },
                  ]}
                >
                  <Text style={styles.notificationIconText}>
                    {getNotificationIcon(notification.type)}
                  </Text>
                </View>
                {!notification.read && <View style={styles.unreadDot} />}
              </View>

              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>
                  {formatTime(notification.createdAt)}
                </Text>
              </View>

              <Text style={styles.notificationArrow}>›</Text>
            </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#007AFF',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  markAllButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  filterTabLeft: {
    marginRight: 5,
  },
  filterTabRight: {
    marginLeft: 5,
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  scrollContent: {
    padding: 15,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationCardUnread: {
    backgroundColor: '#F0F8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationIconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIconText: {
    fontSize: 24,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
    borderColor: '#fff',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationArrow: {
    fontSize: 24,
    color: '#ccc',
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default NotificationsScreen;
