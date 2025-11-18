import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

const { width } = Dimensions.get('window');
const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

interface CalendarEvent {
  _id: string;
  date: string;
  type: 'class' | 'attendance' | 'membership';
  title: string;
  time?: string;
  status?: string;
}

const CalendarScreen = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const fetchCalendarEvents = useCallback(async () => {
    try {
      setLoading(true);
      const userId = (user as any)?._id || (user as any)?.id;
      if (!userId) return;

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await apiService.get(`/calendar/user/${userId}?year=${year}&month=${month}`);
      setEvents(response as CalendarEvent[]);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [user, currentDate]);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedDate = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const calendarDays = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;
      const hasAttendance = dayEvents.some(e => e.type === 'attendance');

      calendarDays.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isToday(date) && styles.todayCell,
            isSelectedDate(date) && styles.selectedCell,
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text
            style={[
              styles.dayText,
              isToday(date) && styles.todayText,
              isSelectedDate(date) && styles.selectedText,
            ]}
          >
            {day}
          </Text>
          {hasEvents && (
            <View style={styles.eventIndicator}>
              {hasAttendance && <View style={styles.attendanceDot} />}
              {dayEvents.length > 1 && (
                <Text style={styles.eventCount}>{dayEvents.length}</Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return calendarDays;
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const renderEventsList = () => {
    if (!selectedDate) {
      // Show upcoming events
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcomingEvents = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

      if (upcomingEvents.length === 0) {
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Không có sự kiện sắp tới</Text>
          </View>
        );
      }

      return (
        <View>
          <Text style={styles.eventsTitle}>📌 Sự kiện sắp tới</Text>
          {upcomingEvents.map(renderEventItem)}
        </View>
      );
    }

    // Show events for selected date
    const dayEvents = getEventsForDate(selectedDate);

    if (dayEvents.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>
            Không có sự kiện vào ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.eventsTitle}>
          📅 Ngày {selectedDate.getDate()}/{selectedDate.getMonth() + 1}/{selectedDate.getFullYear()}
        </Text>
        {dayEvents.map(renderEventItem)}
      </View>
    );
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'class': return '📚';
      case 'attendance': return '✅';
      case 'membership': return '💳';
      default: return '📌';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'class': return '#2196F3';
      case 'attendance': return '#4CAF50';
      case 'membership': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const renderEventItem = (event: CalendarEvent) => {
    const eventDate = new Date(event.date);
    const isTodayEvent = new Date().toDateString() === eventDate.toDateString();

    return (
      <TouchableOpacity
        key={event._id}
        style={styles.eventItem}
        onPress={() => {
          // Navigate to detail if needed
          if (event.type === 'class') {
            // navigation.navigate('ClassDetail', { classId: event._id });
          }
        }}
      >
        <View style={[styles.eventIconContainer, { backgroundColor: getEventColor(event.type) }]}>
          <Text style={styles.eventIcon}>{getEventIcon(event.type)}</Text>
        </View>
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.eventMeta}>
            <Text style={styles.eventDate}>
              {eventDate.getDate()}/{eventDate.getMonth() + 1}/{eventDate.getFullYear()}
              {isTodayEvent && ' • Hôm nay'}
            </Text>
            {event.time && (
              <Text style={styles.eventTime}> • {event.time}</Text>
            )}
          </View>
          {event.status && (
            <View style={[styles.statusBadge, event.status === 'completed' && styles.completedBadge]}>
              <Text style={styles.statusText}>
                {event.status === 'completed' ? '✓ Đã hoàn thành' : event.status}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && events.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={styles.loadingText}>Đang tải lịch...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#581c87', '#1e40af', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>📅 Lịch Tập</Text>
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <Text style={styles.todayButtonText}>Hôm nay</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarContainer}>
        {/* Day Headers */}
        <View style={styles.daysHeader}>
          {DAYS.map(day => (
            <View key={day} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Days */}
        <View style={styles.calendarGrid}>
          {renderCalendar()}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.legendText}>Đã điểm danh</Text>
        </View>
        <View style={styles.legendItem}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Lớp học</Text>
        </View>
        <View style={styles.legendItem}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
          <Text style={styles.legendText}>Membership</Text>
        </View>
      </View>

      {/* Events List */}
      <View style={styles.eventsContainer}>
        {renderEventsList()}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
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
    color: 'rgba(255,255,255,0.7)',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  todayButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1e1b4b',
  },
  monthButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  monthButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  calendarContainer: {
    backgroundColor: '#1e1b4b',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  daysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeaderCell: {
    width: (width - 80) / 7,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: (width - 80) / 7,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  todayCell: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderWidth: 2,
    borderColor: '#ec4899',
  },
  selectedCell: {
    backgroundColor: '#ec4899',
  },
  dayText: {
    fontSize: 14,
    color: '#fff',
  },
  todayText: {
    color: '#ec4899',
    fontWeight: 'bold',
  },
  selectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  attendanceDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#10b981',
  },
  eventCount: {
    fontSize: 8,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e1b4b',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  eventsContainer: {
    paddingHorizontal: 16,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#1e1b4b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  eventIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventIcon: {
    fontSize: 24,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  eventTime: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 24,
  },
});

export default CalendarScreen;
