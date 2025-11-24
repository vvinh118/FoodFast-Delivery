import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useAdminStore } from 'core'; 
import { FaUserFriends, FaStore, FaPlane, FaShoppingBag, FaCalendarAlt } from 'react-icons/fa';

// --- Styled Components ---
const Container = styled.div``;

const Title = styled.h2`
  color: #2c3e50; margin-bottom: 25px;
`;

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white; padding: 20px; border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05); border-left: 5px solid ${p => p.$color};
  display: flex; align-items: center; gap: 15px;
  
  .icon-box {
    width: 50px; height: 50px; border-radius: 50%; background: ${p => p.$color}20;
    display: flex; align-items: center; justify-content: center; color: ${p => p.$color}; font-size: 1.5rem;
  }
  .content { h4 { margin: 0; color: #7f8c8d; font-size: 0.9rem; } .num { font-size: 1.8rem; font-weight: bold; color: #2c3e50; } }
`;

const SectionHeader = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;
`;

const DateInput = styled.div`
  display: flex; align-items: center; gap: 10px; background: white; padding: 8px 15px; border-radius: 6px; border: 1px solid #ddd;
  input { border: none; outline: none; font-family: inherit; color: #2c3e50; }
`;

const OrderTable = styled.table`
  width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
  th { background: #f8f9fa; color: #7f8c8d; font-weight: 600; font-size: 0.9rem; }
  tr:last-child td { border-bottom: none; }
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 500;
  background: ${p => {
    if(p.$status === 'Delivered' || p.$status === 'completed') return '#d4edda';
    if(p.$status === 'Cancelled') return '#f8d7da';
    return '#fff3cd';
  }};
  color: ${p => {
    if(p.$status === 'Delivered' || p.$status === 'completed') return '#155724';
    if(p.$status === 'Cancelled') return '#721c24';
    return '#856404';
  }};
`;

export default function AdminDashboard() {
  const { stats, filteredOrders, selectedDate, isLoading, loadDashboardData, filterOrdersByDate } = useAdminStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    filterOrdersByDate(e.target.value);
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <Container>
      <Title>Tổng quan Hệ thống</Title>

      {/* 4 Cards Thống kê quan trọng */}
      <StatsGrid>
        <StatCard $color="#3498db">
          <div className="icon-box"><FaShoppingBag /></div>
          <div className="content">
            <h4>Đơn hôm nay</h4>
            <div className="num">{stats.totalOrdersToday}</div>
          </div>
        </StatCard>

        <StatCard $color="#e67e22">
          <div className="icon-box"><FaPlane /></div>
          <div className="content">
            <h4>Drone sẵn sàng</h4>
            <div className="num">{stats.activeDrones}</div>
          </div>
        </StatCard>

        <StatCard $color="#2ecc71">
          <div className="icon-box"><FaUserFriends /></div>
          <div className="content">
            <h4>Tổng khách hàng</h4>
            <div className="num">{stats.totalCustomers}</div>
          </div>
        </StatCard>

        <StatCard $color="#9b59b6">
          <div className="icon-box"><FaStore /></div>
          <div className="content">
            <h4>Đối tác Nhà hàng</h4>
            <div className="num">{stats.totalMerchants}</div>
          </div>
        </StatCard>
      </StatsGrid>

      {/* Khu vực danh sách đơn hàng */}
      <SectionHeader>
        <h3 style={{color: '#2c3e50'}}>Danh sách Vận đơn</h3>
        <DateInput>
          <FaCalendarAlt color="#7f8c8d"/>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={handleDateChange} 
          />
        </DateInput>
      </SectionHeader>

      {filteredOrders.length === 0 ? (
        <div style={{textAlign:'center', padding: '40px', background: 'white', borderRadius: '8px', color: '#999'}}>
          Không có đơn hàng nào trong ngày {selectedDate}
        </div>
      ) : (
        <OrderTable>
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Thời gian</th>
              <th>Giá trị</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.userName}</td>
                {/* Giả sử createdAt là ISO string, ta cắt lấy giờ */}
                <td>{new Date(order.createdAt).toLocaleTimeString('vi-VN')}</td>
                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</td>
                <td>
                  <StatusBadge $status={order.status}>{order.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </OrderTable>
      )}
    </Container>
  );
}