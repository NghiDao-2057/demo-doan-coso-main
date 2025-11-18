import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import apiService from '../services/api';

interface ClubDetail {
  _id: string;
  name: string;
  address: string;
  description: string;
  image: string;
}

const ClubDetailScreen = ({ route, navigation }: any) => {
  const { clubId } = route.params;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchClubDetail = useCallback(async () => {
    try {
      const response = await apiService.get(`/clubs/${clubId}`);
      setClub(response as ClubDetail);
    } catch (error) {
      console.error('Error fetching club detail:', error);
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchClubDetail();
  }, [fetchClubDetail]);

  const handleDirections = () => {
    if (club?.address) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(club.address)}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text style={styles.loadingText}>Đang tải chi tiết...</Text>
      </View>
    );
  }

  if (!club) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy câu lạc bộ</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: club.image }}
        style={styles.headerImage}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.clubName}>{club.name}</Text>
        
        <TouchableOpacity style={styles.addressCard} onPress={handleDirections}>
          <View style={styles.addressIcon}>
            <Text style={styles.iconText}>📍</Text>
          </View>
          <View style={styles.addressTextContainer}>
            <Text style={styles.addressLabel}>Địa chỉ</Text>
            <Text style={styles.addressText}>{club.address}</Text>
            <Text style={styles.directionsLink}>Nhấn để xem bản đồ →</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Về câu lạc bộ</Text>
          <Text style={styles.description}>{club.description}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏋️</Text>
            <Text style={styles.infoText}>Trang thiết bị hiện đại</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👥</Text>
            <Text style={styles.infoText}>Huấn luyện viên chuyên nghiệp</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🕐</Text>
            <Text style={styles.infoText}>Mở cửa 24/7</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🅿️</Text>
            <Text style={styles.infoText}>Bãi đỗ xe rộng rãi</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            // Navigate to contact or booking screen
            console.log('Contact club:', club.name);
          }}
        >
          <Text style={styles.contactButtonText}>Liên hệ đăng ký</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  content: {
    padding: 20,
  },
  clubName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 4,
  },
  directionsLink: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  contactButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ClubDetailScreen;
