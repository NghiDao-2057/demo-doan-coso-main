import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiService from '../services/api';

interface ClassItem {
  _id: string;
  name: string;
  description: string;
  instructor: {
    _id: string;
    fullName: string;
  };
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
  capacity: number;
  enrolled: number;
  price: number;
  serviceId: {
    _id: string;
    name: string;
  };
}

interface Service {
  _id: string;
  name: string;
}

const ClassesScreen = ({ navigation }: any) => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState<string>('all');

  useEffect(() => {
    fetchClasses();
    fetchServices();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<ClassItem[]>('/classes');
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await apiService.get<Service[]>('/services');
      setServices(response);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClasses();
  };

  const filteredClasses = useMemo(() => {
    let filtered = classes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          cls.name.toLowerCase().includes(query) ||
          cls.description?.toLowerCase().includes(query) ||
          cls.instructor?.fullName?.toLowerCase().includes(query)
      );
    }

    if (selectedService) {
      filtered = filtered.filter((cls) => cls.serviceId?._id === selectedService);
    }

    if (priceFilter !== 'all') {
      if (priceFilter === 'free') {
        filtered = filtered.filter((cls) => cls.price === 0);
      } else if (priceFilter === 'under500') {
        filtered = filtered.filter((cls) => cls.price > 0 && cls.price < 500000);
      } else if (priceFilter === 'above500') {
        filtered = filtered.filter((cls) => cls.price >= 500000);
      }
    }

    return filtered;
  }, [classes, searchQuery, selectedService, priceFilter]);

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      'Monday': 'T2',
      'Tuesday': 'T3',
      'Wednesday': 'T4',
      'Thursday': 'T5',
      'Friday': 'T6',
      'Saturday': 'T7',
      'Sunday': 'CN',
    };
    return days[day] || day;
  };

  const renderClassItem = ({ item }: { item: ClassItem }) => {
    const availableSlots = item.capacity - item.enrolled;
    const isAlmostFull = availableSlots <= 5;

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('ClassDetail', { classId: item._id })}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#3b82f6', '#6366f1', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.classCard}
        >
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.className}>{item.name}</Text>
              <Text style={styles.serviceName}>📚 {item.serviceId?.name || 'Dịch vụ'}</Text>
            </View>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.priceTag}
            >
              <Text style={styles.priceText}>{item.price.toLocaleString('vi-VN')}đ</Text>
            </LinearGradient>
          </View>

          <View style={styles.instructorSection}>
            <Text style={styles.icon}>👨‍🏫</Text>
            <Text style={styles.instructorName}>{item.instructor?.fullName || 'Chưa có HLV'}</Text>
          </View>

          <View style={styles.scheduleSection}>
            <Text style={styles.sectionTitle}>📅 Lịch học:</Text>
            <View style={styles.scheduleList}>
              {item.schedule && item.schedule.length > 0 ? (
                item.schedule.map((sch, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>{getDayName(sch.dayOfWeek)}</Text>
                    </View>
                    <Text style={styles.timeText}>
                      ⏰ {sch.startTime} - {sch.endTime}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noSchedule}>Chưa có lịch</Text>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.capacitySection}>
              <Text style={styles.icon}>👥</Text>
              <Text style={styles.capacityText}>
                {item.enrolled}/{item.capacity} học viên
              </Text>
            </View>
            {isAlmostFull && (
              <View style={styles.warningBadge}>
                <Text style={styles.warningText}>⚠️ Sắp đầy</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={styles.loadingText}>Đang tải danh sách lớp học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#581c87', '#1e40af']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>📚 LỚP HỌC</Text>
        <Text style={styles.headerSubtitle}>Chọn lớp phù hợp với bạn</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm lớp học..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[styles.filterChip, selectedService === null && styles.filterChipActive]}
          onPress={() => setSelectedService(null)}
        >
          <Text style={[styles.filterChipText, selectedService === null && styles.filterChipTextActive]}>
            Tất cả
          </Text>
        </TouchableOpacity>
        {services.map((service) => (
          <TouchableOpacity
            key={service._id}
            style={[styles.filterChip, selectedService === service._id && styles.filterChipActive]}
            onPress={() => setSelectedService(service._id)}
          >
            <Text style={[styles.filterChipText, selectedService === service._id && styles.filterChipTextActive]}>
              {service.name}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.filterDivider} />
        <TouchableOpacity
          style={[styles.filterChip, priceFilter === 'all' && styles.filterChipActive]}
          onPress={() => setPriceFilter('all')}
        >
          <Text style={[styles.filterChipText, priceFilter === 'all' && styles.filterChipTextActive]}>
            💰 Tất cả giá
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, priceFilter === 'free' && styles.filterChipActive]}
          onPress={() => setPriceFilter('free')}
        >
          <Text style={[styles.filterChipText, priceFilter === 'free' && styles.filterChipTextActive]}>
            Miễn phí
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, priceFilter === 'under500' && styles.filterChipActive]}
          onPress={() => setPriceFilter('under500')}
        >
          <Text style={[styles.filterChipText, priceFilter === 'under500' && styles.filterChipTextActive]}>
            {'< 500k'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, priceFilter === 'above500' && styles.filterChipActive]}
          onPress={() => setPriceFilter('above500')}
        >
          <Text style={[styles.filterChipText, priceFilter === 'above500' && styles.filterChipTextActive]}>
            {'>= 500k'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          🎯 Tìm thấy {filteredClasses.length} lớp học
        </Text>
      </View>

      <FlatList
        data={filteredClasses}
        renderItem={renderClassItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#ec4899"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Chưa có lớp học nào</Text>
            <Text style={styles.emptySubtext}>Kéo xuống để làm mới</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  classCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  className: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  priceTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  instructorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    fontSize: 20,
    marginRight: 10,
  },
  instructorName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scheduleSection: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  scheduleList: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 6,
  },
  dayBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  dayBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  timeText: {
    fontSize: 15,
    color: '#fff',
  },
  noSchedule: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  capacitySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  warningBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1b4b',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  clearIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
    padding: 6,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#1e1b4b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  filterChipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
  },
});

export default ClassesScreen;
