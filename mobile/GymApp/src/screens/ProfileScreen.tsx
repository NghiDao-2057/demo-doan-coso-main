import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import apiService from '../services/api';

interface Membership {
  _id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loadingMembership, setLoadingMembership] = useState(true);

  const fetchMembership = useCallback(async () => {
    try {
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) {
        setLoadingMembership(false);
        return;
      }

      const response = await apiService.get(`/memberships/user/${userId}`);
      if (response && Array.isArray(response) && response.length > 0) {
        setMembership(response[0]);
      } else {
        setMembership(null);
      }
    } catch (error: any) {
      // Silently handle 404 or no membership case
      const status = error?.response?.status;
      if (status === 404 || status === 400) {
        // User has no membership - this is ok
        setMembership(null);
      } else {
        console.error('Error fetching membership:', error);
      }
    } finally {
      setLoadingMembership(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

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

  const userAvatar = (user as any)?.avatar || (user as any)?.profilePicture;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#581c87', '#1e40af']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          {userAvatar ? (
            <Image
              source={{ uri: userAvatar }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{user?.name || 'Người dùng'}</Text>
        <Text style={styles.email}>{user?.email || ''}</Text>
      </LinearGradient>

      {/* Membership Card */}
      {loadingMembership ? (
        <View style={styles.membershipLoading}>
          <ActivityIndicator color="#ec4899" />
        </View>
      ) : membership ? (
        <LinearGradient
          colors={['#ec4899', '#ef4444', '#f97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.membershipCard}
        >
          <View style={styles.membershipHeader}>
            <Text style={styles.membershipIcon}>💳</Text>
            <View style={styles.membershipInfo}>
              <Text style={styles.membershipType}>{membership.type}</Text>
              <Text style={styles.membershipStatus}>
                {membership.status === 'active' ? '✓ Đang hoạt động' : 'Hết hạn'}
              </Text>
            </View>
          </View>
          <View style={styles.membershipDates}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Bắt đầu:</Text>
              <Text style={styles.dateValue}>
                {new Date(membership.startDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Hết hạn:</Text>
              <Text style={styles.dateValue}>
                {new Date(membership.endDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.noMembershipCard}>
          <Text style={styles.noMembershipIcon}>💳</Text>
          <Text style={styles.noMembershipText}>Chưa có gói thành viên</Text>
          <Text style={styles.noMembershipSubtext}>
            Đăng ký ngay để trải nghiệm!
          </Text>
        </View>
      )}

      <View style={styles.section}>
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
          onPress={() => navigation.navigate('MyClasses')}
        >
          <Text style={styles.menuIcon}>📚</Text>
          <Text style={styles.menuText}>Lớp của tôi</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>Thống kê</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.menuIcon}>🎯</Text>
          <Text style={styles.menuText}>Mục tiêu</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('BodyMetrics')}
        >
          <Text style={styles.menuIcon}>📏</Text>
          <Text style={styles.menuText}>Số đo cơ thể</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('ChatList')}
        >
          <Text style={styles.menuIcon}>💬</Text>
          <Text style={styles.menuText}>Tin nhắn & Hỗ trợ</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Thông báo</Text>
          <View style={styles.notificationBadgeSmall}>
            <Text style={styles.notificationBadgeSmallText}>3</Text>
          </View>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.menuIcon}>📊</Text>
          <Text style={styles.menuText}>Lịch sử</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Membership')}
        >
          <Text style={styles.menuIcon}>💳</Text>
          <Text style={styles.menuText}>Gói thành viên</Text>
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

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Cài đặt</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>Về chúng tôi</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout}>
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 40,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 50,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    backgroundColor: '#1e1b4b',
    marginTop: 20,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  menuArrow: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  logoutButton: {
    margin: 20,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  membershipLoading: {
    padding: 20,
    alignItems: 'center',
  },
  membershipCard: {
    margin: 16,
    marginTop: -40,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  membershipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  membershipIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  membershipInfo: {
    flex: 1,
  },
  membershipType: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  membershipStatus: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
    opacity: 0.9,
  },
  membershipDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  noMembershipCard: {
    backgroundColor: '#1e1b4b',
    margin: 16,
    marginTop: -40,
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  noMembershipIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  noMembershipText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  noMembershipSubtext: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  notificationBadgeSmall: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 8,
  },
  notificationBadgeSmallText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
