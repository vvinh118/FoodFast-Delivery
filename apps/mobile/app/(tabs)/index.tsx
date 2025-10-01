import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Đây là Component Màn hình chính của ứng dụng
export default function HomeScreen() {
  return (
    // SafeAreaView giúp nội dung không bị che bởi tai thỏ (notch) trên điện thoại
    <SafeAreaView style={styles.container}>
      
      {/* 1. Phần Header/Thanh tìm kiếm */}
      <View style={styles.header}>
        <Text style={styles.appName}>FoodFast Delivery</Text>
        <Text style={styles.location}>Giao hàng đến: 172.16.98.188</Text>
      </View>

      {/* 2. Phần Nội dung có thể cuộn */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Thanh tìm kiếm (Placeholder) */}
        <View style={styles.searchBar}>
          <Text style={{ color: '#aaa' }}>Nhấn để tìm kiếm món ăn...</Text>
        </View>

        {/* Khu vực Danh mục */}
        <Text style={styles.sectionTitle}>Danh Mục Phổ Biến</Text>
        <View style={styles.categoryRow}>
          {/* Bạn sẽ thay thế bằng Component Category sau này */}
          <Text style={styles.categoryItem}>🍔 Burger</Text>
          <Text style={styles.categoryItem}>🍕 Pizza</Text>
          <Text style={styles.categoryItem}>🍜 Mì</Text>
        </View>

        {/* Khu vực Danh sách Sản phẩm */}
        <Text style={styles.sectionTitle}>Món Ngon Gần Bạn</Text>
        {/* Thẻ sản phẩm mẫu (Placeholder) */}
        <View style={styles.productCard}>
            <Text style={styles.productName}>Món Ăn Số 1</Text>
            <Text style={styles.productPrice}>69.000 VNĐ</Text>
        </View>
        <View style={styles.productCard}>
            <Text style={styles.productName}>Món Ăn Số 2</Text>
            <Text style={styles.productPrice}>45.000 VNĐ</Text>
        </View>
        {/* Thêm nhiều thẻ sản phẩm khác ở đây */}
        <Text style={{ marginVertical: 20, textAlign: 'center', color: '#888' }}>-- Hết món ăn --</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// Định nghĩa các Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 20, // Khoảng trống dưới cùng
  },
  header: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E53935', // Màu đỏ thương hiệu (ví dụ)
  },
  location: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
    color: '#333',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  categoryItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#E53935',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  }
});