import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

interface EnrolledClass {
  _id: string;
  classId: {
    _id: string;
    name: string;
    instructor: string;
    schedule: string;
    capacity: number;
  };
  enrolledAt: string;
  status: string;
}

const MyClassesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyClasses = useCallback(async () => {
    try {
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) return;

      const response = await apiService.get(`/classes/enrollments/user/${userId}`);
      setClasses(response as EnrolledClass[]);
    } catch (error) {
      console.error('Error fetching my classes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyClasses();
  }, [fetchMyClasses]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyClasses();
  };

  const handleUnenroll = (classId: string, className: string) => {
    Alert.alert(
      'Hủy đăng ký',
      `Bạn có chắc muốn hủy đăng ký lớp "${className}"?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có',
          style: 'destructive',
          onPress: async () => {
            try {
              const userId = (user as any)?._id || (user as any)?.id;
              await apiService.delete(`/classes/${classId}/enroll/${userId}`);
              Alert.alert('Thành công', 'Đã hủy đăng ký lớp học');
              fetchMyClasses();
            } catch (error) {
              console.error('Error unenrolling:', error);
              Alert.alert('Lỗi', 'Không thể hủy đăng ký lớp học');
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (classId: string) => {
    navigation.navigate('ClassDetail', { classId });
  };

  const renderClassCard = (enrollment: EnrolledClass) => {
    const classData = enrollment.classId;
    if (!classData) return null;

    return (
      <View key={enrollment._id} style={styles.classCard}>
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.className}>{classData.name}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {enrollment.status === 'active' ? 'Đang học' : 'Hoàn thành'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👨‍🏫</Text>
            <Text style={styles.infoText}>{classData.instructor}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>{classData.schedule}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👥</Text>
            <Text style={styles.infoText}>Sức chứa: {classData.capacity} người</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📝</Text>
            <Text style={styles.infoText}>
              Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => navigation.navigate('AttendanceCheckIn', { 
              classId: classData._id,
              className: classData.name 
            })}
          >
            <Text style={styles.checkInButtonText}>✓ Điểm danh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(classData._id)}
          >
            <Text style={styles.viewButtonText}>Xem chi tiết</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.unenrollButton}
            onPress={() => handleUnenroll(classData._id, classData.name)}
          >
            <Text style={styles.unenrollButtonText}>Hủy đăng ký</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải lớp học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lớp Của Tôi</Text>
        <Text style={styles.headerSubtitle}>
          {classes.length} lớp đã đăng ký
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {classes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Chưa đăng ký lớp nào</Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Classes')}
            >
              <Text style={styles.browseButtonText}>Khám phá lớp học</Text>
            </TouchableOpacity>
          </View>
        ) : (
          classes.map(renderClassCard)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#4CAF5020',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  cardBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 28,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  checkInButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  checkInButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  unenrollButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  unenrollButtonText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MyClassesScreen;
