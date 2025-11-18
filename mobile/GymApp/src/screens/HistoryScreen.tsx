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
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';

interface Payment {
  _id: string;
  amount: number;
  method: string;
  status: string;
  paymentType: string;
  createdAt: string;
}

interface Attendance {
  _id: string;
  classId: {
    name: string;
  };
  sessionNumber: number;
  sessionDate: string;
  isPresent: boolean;
  checkinTime: string;
}

const HistoryScreen = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'payments' | 'attendance'>('payments');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) return;

      const response = await apiService.get(`/payments/user/${userId}`);
      setPayments(response as Payment[]);
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Set empty array on error to avoid showing error toast
      setPayments([]);
    }
  }, [user]);

  const fetchAttendances = useCallback(async () => {
    try {
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) return;

      const response = await apiService.get(`/attendances/user/${userId}/report`);
      setAttendances(response as Attendance[]);
    } catch (error) {
      console.error('Error fetching attendances:', error);
      // Set empty array on error to avoid showing error toast
      setAttendances([]);
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchPayments(), fetchAttendances()]);
    setLoading(false);
    setRefreshing(false);
  }, [fetchPayments, fetchAttendances]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'cancelled':
      case 'failed':
        return '#FF3B30';
      default:
        return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const renderPaymentItem = (payment: Payment) => (
    <View key={payment._id} style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardIcon}>💳</Text>
          <View>
            <Text style={styles.cardTitle}>{payment.paymentType || 'Thanh toán'}</Text>
            <Text style={styles.cardSubtitle}>{payment.method}</Text>
          </View>
        </View>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.amount}>{formatCurrency(payment.amount)}</Text>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.date}>{formatDate(payment.createdAt)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(payment.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(payment.status) }]}>
            {getStatusText(payment.status)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderAttendanceItem = (attendance: Attendance) => (
    <View key={attendance._id} style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.cardIcon}>{attendance.isPresent ? '✅' : '❌'}</Text>
          <View>
            <Text style={styles.cardTitle}>{attendance.classId?.name || 'Lớp học'}</Text>
            <Text style={styles.cardSubtitle}>Buổi {attendance.sessionNumber}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.date}>
          {formatDate(attendance.sessionDate)}
          {attendance.checkinTime && ` - ${formatTime(attendance.checkinTime)}`}
        </Text>
        <View style={[
          styles.statusBadge, 
          attendance.isPresent ? styles.presentBadge : styles.absentBadge
        ]}>
          <Text style={[
            styles.statusText, 
            attendance.isPresent ? styles.presentText : styles.absentText
          ]}>
            {attendance.isPresent ? 'Có mặt' : 'Vắng mặt'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải lịch sử...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch Sử</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'payments' && styles.activeTab]}
          onPress={() => setActiveTab('payments')}
        >
          <Text style={[styles.tabText, activeTab === 'payments' && styles.activeTabText]}>
            Thanh toán
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'attendance' && styles.activeTab]}
          onPress={() => setActiveTab('attendance')}
        >
          <Text style={[styles.tabText, activeTab === 'attendance' && styles.activeTabText]}>
            Điểm danh
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'payments' ? (
          payments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💳</Text>
              <Text style={styles.emptyText}>Chưa có lịch sử thanh toán</Text>
            </View>
          ) : (
            payments.map(renderPaymentItem)
          )
        ) : (
          attendances.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📋</Text>
              <Text style={styles.emptyText}>Chưa có lịch sử điểm danh</Text>
            </View>
          ) : (
            attendances.map(renderAttendanceItem)
          )
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
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  cardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  presentBadge: {
    backgroundColor: '#34C75920',
  },
  absentBadge: {
    backgroundColor: '#FF3B3020',
  },
  presentText: {
    color: '#34C759',
  },
  absentText: {
    color: '#FF3B30',
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
    textAlign: 'center',
  },
});

export default HistoryScreen;
