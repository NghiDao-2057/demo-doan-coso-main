import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  type: string;
  features: string[];
  category: string;
  popular?: boolean;
  badge?: string;
}

const MembershipScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  // Hardcoded plans data (matching web's pricingPlansData.js)
  const membershipPlans: MembershipPlan[] = [
    // BASIC
    {
      id: 'basic-monthly',
      name: 'Gói Cơ Bản Hàng Tháng',
      price: 399000,
      duration: 30,
      type: 'Basic',
      category: 'basic',
      features: [
        'Tập luyện tại 01 CLB đã chọn',
        'Giờ tập: 08:00 - 22:00 hàng ngày',
        'Tủ đồ tiêu chuẩn',
        'Nước uống miễn phí',
      ],
    },
    {
      id: 'basic-quarterly',
      name: 'Gói Cơ Bản 3 Tháng',
      price: 1089000,
      duration: 90,
      type: 'Basic',
      category: 'basic',
      popular: true,
      badge: 'Phổ biến',
      features: [
        'Tập luyện tại 01 CLB đã chọn',
        'Giờ tập: 08:00 - 22:00 hàng ngày',
        'Tủ đồ tiêu chuẩn',
        'Nước uống miễn phí',
        'Tư vấn dinh dưỡng cơ bản',
      ],
    },
    // STANDARD
    {
      id: 'standard-monthly',
      name: 'Gói Tiêu Chuẩn Hàng Tháng',
      price: 699000,
      duration: 30,
      type: 'Standard',
      category: 'standard',
      features: [
        'Tập luyện tại 01 CLB đã chọn',
        'Tham gia Yoga và Group X',
        'Giờ tập: 06:00 - 23:00',
        'Dịch vụ thư giãn (sauna)',
        'Tủ đồ cao cấp',
        'Nước uống & khăn tập miễn phí',
      ],
    },
    {
      id: 'standard-quarterly',
      name: 'Gói Tiêu Chuẩn 3 Tháng',
      price: 1899000,
      duration: 90,
      type: 'Standard',
      category: 'standard',
      popular: true,
      badge: 'Tiết kiệm 10%',
      features: [
        'Tập luyện tại 01 CLB đã chọn',
        'Tham gia Yoga và Group X',
        'Giờ tập: 06:00 - 23:00',
        'Dịch vụ thư giãn',
        'Tủ đồ cao cấp',
        'PT cá nhân (2 buổi)',
      ],
    },
    // VIP
    {
      id: 'vip-monthly',
      name: 'Gói VIP Hàng Tháng',
      price: 1499000,
      duration: 30,
      type: 'VIP',
      category: 'vip',
      features: [
        'Tập tại TẤT CẢ CLB',
        'Yoga & Group X không giới hạn',
        'Giờ tập: 24/7',
        'Tủ đồ VIP cố định',
        'PT cá nhân (2 buổi/tháng)',
        'Ưu tiên đặt lịch',
      ],
    },
    {
      id: 'vip-quarterly',
      name: 'Gói VIP 3 Tháng',
      price: 3999000,
      duration: 90,
      type: 'VIP',
      category: 'vip',
      popular: true,
      badge: 'Trải nghiệm VIP',
      features: [
        'Tập tại TẤT CẢ CLB',
        'Yoga & Group X không giới hạn',
        'Giờ tập: 24/7',
        'Tủ đồ VIP',
        'PT cá nhân (4 buổi)',
        'Spa & massage giảm 15%',
      ],
    },
  ];

  useEffect(() => {
    setLoading(false);
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic':
        return '#3b82f6';
      case 'standard':
        return '#10b981';
      case 'vip':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  const getDurationText = (duration: number) => {
    if (duration === 30) return '1 tháng';
    if (duration === 90) return '3 tháng';
    if (duration === 180) return '6 tháng';
    if (duration === 365) return '1 năm';
    return `${duration} ngày`;
  };

  const handlePurchase = (plan: MembershipPlan) => {
    if (!user) {
      Alert.alert('Chưa đăng nhập', 'Vui lòng đăng nhập để đăng ký gói thành viên');
      return;
    }

    // Show payment modal
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedPlan || !user) return;

    try {
      setPurchasing(selectedPlan.id);
      
      const userId = (user as any)?._id || (user as any)?.id;
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + selectedPlan.duration * 24 * 60 * 60 * 1000);

      await apiService.post('/memberships', {
        userId,
        type: selectedPlan.type,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        price: selectedPlan.price,
      });

      Alert.alert(
        'Thành công!',
        'Đăng ký gói thành viên thành công! Gói sẽ được kích hoạt sau khi xác nhận thanh toán.'
      );
      
      // Navigate to profile to see membership
      navigation.navigate('Profile');
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể đăng ký gói thành viên');
    } finally {
      setPurchasing(null);
    }
  };

  const filteredPlans = membershipPlans.filter(
    (plan) => plan.category === selectedCategory
  );

  const renderPlanCard = (plan: MembershipPlan) => {
    const color = getCategoryColor(plan.category);
    const isPurchasing = purchasing === plan.id;

    return (
      <View key={plan.id} style={[styles.planCard, plan.popular && styles.popularCard]}>
        {plan.popular && (
          <View style={[styles.popularBadge, { backgroundColor: color }]}>
            <Text style={styles.popularBadgeText}>⭐ {plan.badge || 'Phổ biến'}</Text>
          </View>
        )}

        <View style={styles.planHeader}>
          <Text style={styles.planName}>{plan.name}</Text>
          <Text style={[styles.planType, { color }]}>{plan.type}</Text>
        </View>

        <View style={[styles.priceContainer, { backgroundColor: color }]}>
          <Text style={styles.priceText}>
            {plan.price.toLocaleString('vi-VN')}đ
          </Text>
          <Text style={styles.durationText}>{getDurationText(plan.duration)}</Text>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Quyền lợi:</Text>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureIcon}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.purchaseButton, { backgroundColor: color }]}
          onPress={() => handlePurchase(plan)}
          disabled={isPurchasing}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.purchaseButtonText}>Đăng ký ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ec4899" />
        <Text style={styles.loadingText}>Đang tải gói thành viên...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#581c87', '#1e40af', '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Gói thành viên</Text>
        <Text style={styles.headerSubtitle}>Chọn gói phù hợp với bạn</Text>
      </LinearGradient>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        {[
          { key: 'basic', label: '🏃 Cơ bản' },
          { key: 'standard', label: '💪 Tiêu chuẩn' },
          { key: 'vip', label: '👑 VIP' },
        ].map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryButton,
              selectedCategory === cat.key && styles.categoryButtonActive,
              selectedCategory === cat.key && {
                backgroundColor: getCategoryColor(cat.key),
              },
            ]}
            onPress={() => setSelectedCategory(cat.key)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat.key && styles.categoryButtonTextActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredPlans.map((plan) => renderPlanCard(plan))}
      </ScrollView>

      {/* Payment Modal */}
      {selectedPlan && user && (
        <PaymentModal
          visible={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          onSuccess={handlePaymentSuccess}
          itemType="membership"
          itemId={selectedPlan.id}
          itemName={selectedPlan.name}
          amount={selectedPlan.price}
          userId={(user as any)?._id || (user as any)?.id}
        />
      )}
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
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  categoryContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'transparent',
    marginTop: 10,
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#1e1b4b',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryButtonActive: {
    backgroundColor: '#ec4899',
    borderColor: '#ec4899',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  planCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  popularCard: {
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: 15,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  planType: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceContainer: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  durationText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 10,
    fontWeight: 'bold',
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
    lineHeight: 20,
  },
  purchaseButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MembershipScreen;
