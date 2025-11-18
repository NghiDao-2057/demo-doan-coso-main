import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

type GymFinderScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GymFinder"
>;

type Props = {
  navigation?: GymFinderScreenNavigationProp;
};

interface GymLocation {
  _id: string;
  name: string;
  address: string;
  city: string;
  district?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  phone?: string;
  email?: string;
  openingHours?: string;
  facilities?: string[];
  rating: number;
  totalReviews: number;
  distance?: string;
}

const GymFinderScreen: React.FC<Props> = () => {
  const [gyms, setGyms] = useState<GymLocation[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<GymLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "rating">("name");

  useEffect(() => {
    fetchAllGyms();
  }, []);

  useEffect(() => {
    filterAndSortGyms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortBy, gyms]);

  const fetchAllGyms = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const response = await fetch("http://10.0.2.2:5000/api/gyms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setGyms(data);
    } catch (error) {
      console.error("Error fetching gyms:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách phòng gym");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGyms = () => {
    let result = [...gyms];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (gym) =>
          gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gym.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          gym.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setFilteredGyms(result);
  };

  const openDirections = (gym: GymLocation) => {
    const scheme = Platform.select({
      ios: "maps:",
      android: "geo:",
    });
    const url = Platform.select({
      ios: `${scheme}${gym.coordinates.latitude},${gym.coordinates.longitude}?q=${gym.name}`,
      android: `${scheme}${gym.coordinates.latitude},${gym.coordinates.longitude}?q=${gym.name}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Đang tải danh sách phòng gym...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, địa chỉ, thành phố..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      {/* Sort Options */}
      <ScrollView horizontal style={styles.sortContainer} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "name" && styles.sortButtonActive]}
          onPress={() => setSortBy("name")}
        >
          <Text style={[styles.sortButtonText, sortBy === "name" && styles.sortButtonTextActive]}>
            🔤 Tên A-Z
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "rating" && styles.sortButtonActive]}
          onPress={() => setSortBy("rating")}
        >
          <Text style={[styles.sortButtonText, sortBy === "rating" && styles.sortButtonTextActive]}>
            ⭐ Đánh giá cao
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Gym List */}
      <ScrollView style={styles.gymList}>
        {filteredGyms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏋️</Text>
            <Text style={styles.emptyText}>Không tìm thấy phòng gym nào</Text>
            <Text style={styles.emptySubText}>
              Thử tìm kiếm với từ khóa khác hoặc mở rộng khoảng cách
            </Text>
          </View>
        ) : (
          filteredGyms.map((gym) => (
            <View key={gym._id} style={styles.gymCard}>
              <View style={styles.gymHeader}>
                <Text style={styles.gymName}>{gym.name}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingIcon}>⭐</Text>
                  <Text style={styles.ratingText}>
                    {gym.rating.toFixed(1)} ({gym.totalReviews})
                  </Text>
                </View>
              </View>

              <Text style={styles.gymAddress}>📍 {gym.address}</Text>
              {gym.district && (
                <Text style={styles.gymDistrict}>{gym.district}, {gym.city}</Text>
              )}

              {gym.openingHours && (
                <Text style={styles.gymHours}>🕐 {gym.openingHours}</Text>
              )}

              {gym.facilities && gym.facilities.length > 0 && (
                <View style={styles.facilitiesContainer}>
                  {gym.facilities.slice(0, 3).map((facility, index) => (
                    <View key={index} style={styles.facilityTag}>
                      <Text style={styles.facilityText}>{facility}</Text>
                    </View>
                  ))}
                  {gym.facilities.length > 3 && (
                    <Text style={styles.facilitiesMore}>+{gym.facilities.length - 3}</Text>
                  )}
                </View>
              )}

              <View style={styles.gymActions}>
                {gym.phone && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => callPhone(gym.phone!)}
                  >
                    <Text style={styles.actionButtonText}>📞 Gọi điện</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.actionButtonPrimary]}
                  onPress={() => openDirections(gym)}
                >
                  <Text style={styles.actionButtonPrimaryText}>🗺️ Chỉ đường</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  sortContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  sortButtonActive: {
    backgroundColor: "#4CAF50",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  sortButtonTextActive: {
    color: "#fff",
  },
  gymList: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  gymCard: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gymHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  gymName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  gymAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  gymDistrict: {
    fontSize: 13,
    color: "#999",
    marginBottom: 8,
  },
  gymDistance: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
    marginBottom: 4,
  },
  gymHours: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  facilityTag: {
    backgroundColor: "#e8f5e9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  facilityText: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  facilitiesMore: {
    fontSize: 12,
    color: "#999",
    alignSelf: "center",
  },
  gymActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "600",
  },
  actionButtonPrimary: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  actionButtonPrimaryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  refreshButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default GymFinderScreen;
