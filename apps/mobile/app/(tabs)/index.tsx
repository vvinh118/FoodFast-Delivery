
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchRestaurants, Restaurant, formatCurrency, APP_CONSTANTS } from 'core';

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. GỌI API (Logic giống hệt Web)
  useEffect(() => {
    fetchRestaurants()
      .then((data) => {
        setRestaurants(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // 4. GIAO DIỆN TỪNG MÓN (NATIVE UI)
  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity style={styles.card}>
      {/* Ảnh nhà hàng */}
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      
      {/* Thông tin */}
      <View style={styles.cardContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>{item.name}</Text>
        
        <View style={styles.row}>
          <Text style={styles.infoText}>⭐ {item.rating}</Text>
          <Text style={styles.infoText}> • </Text>
          <Text style={styles.infoText}>🕒 {item.deliveryTime} phút</Text>
          <Text style={styles.infoText}> • </Text>
          <Text style={styles.infoText}>🛵 {item.distance} km</Text>
        </View>

        {/* Ví dụ dùng hàm formatCurrency từ CORE */}
        <Text style={styles.priceText}>
          Phí ship: {formatCurrency(APP_CONSTANTS.DELIVERY_FEE)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F72D57" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Chào mừng bạn đến với</Text>
        <Text style={styles.logoText}>FoodFast Mobile 🚀</Text>
      </View>

      {/* Danh sách nhà hàng */}
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRestaurantItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// 5. STYLES (CSS in JS)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F72D57', // Màu thương hiệu
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Đổ bóng cho Android
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180, // Chiều cao ảnh cố định
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F72D57',
    marginTop: 5,
  },
});