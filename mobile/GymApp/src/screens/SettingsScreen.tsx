import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const SettingsScreen = ({ navigation }: any) => {
  const { logout, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notifTypes, setNotifTypes] = useState({
    class: true,
    payment: true,
    membership: true,
    attendance: true,
    system: true,
    goal: true,
  });

  useEffect(() => {
    // Load user notification preferences
    const loadPreferences = async () => {
      try {
        const userId = (user as any)?._id || (user as any)?.id;
        if (userId) {
          const response = await apiService.get(`/users/${userId}`);
          const userData = response as any;
          if (userData.notificationPreferences) {
            setNotificationsEnabled(userData.notificationPreferences.enabled ?? true);
            setNotifTypes(userData.notificationPreferences.types || notifTypes);
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateNotificationPreferences = async (enabled?: boolean, types?: any) => {
    try {
      const userId = (user as any)?._id || (user as any)?.id;
      if (userId) {
        await apiService.put(`/users/${userId}`, {
          notificationPreferences: {
            enabled: enabled !== undefined ? enabled : notificationsEnabled,
            types: types || notifTypes,
          },
        });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật cài đặt thông báo');
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await updateNotificationPreferences(value, notifTypes);
  };

  const handleNotifTypeToggle = async (type: string, value: boolean) => {
    const newTypes = { ...notifTypes, [type]: value };
    setNotifTypes(newTypes);
    await updateNotificationPreferences(notificationsEnabled, newTypes);
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Thông báo', 'Chức năng đang phát triển');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>Chỉnh sửa hồ sơ</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation.navigate('ChangePassword')}
          >
            <Text style={styles.menuIcon}>🔒</Text>
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông báo</Text>
          
          <View style={styles.switchItem}>
            <View style={styles.switchLeft}>
              <Text style={styles.menuIcon}>🔔</Text>
              <View>
                <Text style={styles.menuText}>Bật thông báo</Text>
                <Text style={styles.switchSubtext}>Nhận tất cả thông báo</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: '#E0E0E0', true: '#4CAF5080' }}
              thumbColor={notificationsEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>

          {notificationsEnabled && (
            <>
              <View style={styles.switchItem}>
                <View style={styles.switchLeft}>
                  <Text style={styles.menuIcon}>💪</Text>
                  <View>
                    <Text style={styles.menuText}>Lớp học</Text>
                    <Text style={styles.switchSubtext}>Thông báo về lớp học</Text>
                  </View>
                </View>
                <Switch
                  value={notifTypes.class}
                  onValueChange={(value) => handleNotifTypeToggle('class', value)}
                  trackColor={{ false: '#E0E0E0', true: '#4CAF5080' }}
                  thumbColor={notifTypes.class ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchLeft}>
                  <Text style={styles.menuIcon}>💳</Text>
                  <View>
                    <Text style={styles.menuText}>Thanh toán</Text>
                    <Text style={styles.switchSubtext}>Thông báo thanh toán</Text>
                  </View>
                </View>
                <Switch
                  value={notifTypes.payment}
                  onValueChange={(value) => handleNotifTypeToggle('payment', value)}
                  trackColor={{ false: '#E0E0E0', true: '#4CAF5080' }}
                  thumbColor={notifTypes.payment ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchLeft}>
                  <Text style={styles.menuIcon}>🎫</Text>
                  <View>
                    <Text style={styles.menuText}>Thẻ thành viên</Text>
                    <Text style={styles.switchSubtext}>Thông báo về thẻ</Text>
                  </View>
                </View>
                <Switch
                  value={notifTypes.membership}
                  onValueChange={(value) => handleNotifTypeToggle('membership', value)}
                  trackColor={{ false: '#E0E0E0', true: '#4CAF5080' }}
                  thumbColor={notifTypes.membership ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchLeft}>
                  <Text style={styles.menuIcon}>✓</Text>
                  <View>
                    <Text style={styles.menuText}>Điểm danh</Text>
                    <Text style={styles.switchSubtext}>Thông báo điểm danh</Text>
                  </View>
                </View>
                <Switch
                  value={notifTypes.attendance}
                  onValueChange={(value) => handleNotifTypeToggle('attendance', value)}
                  trackColor={{ false: '#E0E0E0', true: '#4CAF5080' }}
                  thumbColor={notifTypes.attendance ? '#4CAF50' : '#f4f3f4'}
                />
              </View>

              <View style={styles.switchItem}>
                <View style={styles.switchLeft}>
                  <Text style={styles.menuIcon}>🎯</Text>
                  <View>
                    <Text style={styles.menuText}>Mục tiêu</Text>
                    <Text style={styles.switchSubtext}>Thông báo mục tiêu</Text>
                  </View>
                </View>
                <Switch
                  value={notifTypes.goal}
                  onValueChange={(value) => handleNotifTypeToggle('goal', value)}
                  trackColor={{ false: '#E0E0E0', true: '#4CAF5080' }}
                  thumbColor={notifTypes.goal ? '#4CAF50' : '#f4f3f4'}
                />
              </View>
            </>
          )}

          <View style={styles.switchItem}>
            <View style={styles.switchLeft}>
              <Text style={styles.menuIcon}>📍</Text>
              <View>
                <Text style={styles.menuText}>Vị trí</Text>
                <Text style={styles.switchSubtext}>Cho phép truy cập vị trí</Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF5080' }}
              thumbColor={locationEnabled ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Về ứng dụng</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>Thông tin ứng dụng</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📜</Text>
            <Text style={styles.menuText}>Điều khoản dịch vụ</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔐</Text>
            <Text style={styles.menuText}>Chính sách bảo mật</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.versionItem}>
            <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nguy hiểm</Text>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteButtonText}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  versionItem: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#FF9500',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
