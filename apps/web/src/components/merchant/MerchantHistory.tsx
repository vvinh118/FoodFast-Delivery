import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaSearch, FaEye, FaFileDownload } from 'react-icons/fa';
import { fetchOrders, useMerchantStore } from 'core';

// Import Modal chi tiết
import OrderDetailModal from '../../components/merchant/OrderDetailModal';

// === TYPES ===
export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    restaurantId?: string;
}

export interface Order {
    id: string;
    userId: string;
    userName: string; 
    userPhone: string;
    userAddress: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    status: 'Pending' | 'Preparing' | 'Ready' | 'Delivering' | 'Delivered' | 'Cancelled'; 
    createdAt: string;
}

// === STYLED COMPONENTS ===
const Container = styled.div``;
const Header = styled.div` margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; `;
const Title = styled.h1` font-size: 2rem; font-weight: 700; color: #333; margin: 0 0 5px 0; `;
const Subtitle = styled.p` font-size: 1rem; color: #666; margin: 0; `;
const Toolbar = styled.div` display: flex; gap: 15px; margin-bottom: 25px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); `;
const SearchBox = styled.div` display: flex; align-items: center; border: 1px solid #ddd; border-radius: 6px; padding: 0 15px; flex-grow: 1; max-width: 400px; input { border: none; padding: 10px; flex-grow: 1; outline: none; font-size: 0.95rem; } svg { color: #888; } `;
const FilterSelect = styled.select` padding: 0 15px; border: 1px solid #ddd; border-radius: 6px; outline: none; font-size: 0.95rem; background: white; cursor: pointer; min-width: 150px; `;
const TableWrapper = styled.div` background: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden; `;
const Table = styled.table` width: 100%; border-collapse: collapse; thead { background-color: #f8f9fa; border-bottom: 2px solid #eee; } th { text-align: left; padding: 18px 20px; font-weight: 600; color: #555; font-size: 0.9rem; } td { padding: 15px 20px; border-bottom: 1px solid #eee; color: #333; vertical-align: middle; } tr:last-child td { border-bottom: none; } tr:hover { background-color: #fcfcfc; } `;
const StatusBadge = styled.span<{ $status: string }>` padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; ${props => props.$status === 'Delivered' && `background-color: #d4edda; color: #155724;`} ${props => props.$status === 'Cancelled' && `background-color: #f8d7da; color: #721c24;`} `;
const ActionButton = styled.button` background: none; border: 1px solid #ddd; padding: 6px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 5px; color: #555; font-size: 0.85rem; transition: all 0.2s; &:hover { background-color: #f0f0f0; color: #333; } `;
const EmptyState = styled.div` padding: 50px; text-align: center; color: #888; font-size: 1.1rem; `;

// === COMPONENT ===
const MerchantHistory: React.FC = () => {
    const merchant = useMerchantStore(state => state.merchant);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State cho bộ lọc
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); 

    // State cho Modal chi tiết
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (merchant?.restaurantId) {
            setLoading(true);
            fetchOrders()
                .then((allData: any[]) => {
                    const historyOrders = allData.filter(o => 
                        o.items.some((i: any) => String(i.restaurantId) === String(merchant.restaurantId)) &&
                        (o.status === 'Delivered' || o.status === 'Cancelled')
                    );
                    setOrders(historyOrders);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [merchant]);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
            const searchLower = searchTerm.toLowerCase();
            return (
                order.id.toLowerCase().includes(searchLower) ||
                order.userName.toLowerCase().includes(searchLower)
            );
        });
    }, [orders, searchTerm, statusFilter]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}`;
    };

    // Helper tính toán
    const calculateMetrics = (order: Order) => {
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // CÔNG THỨC MỚI: 
        // 1. Doanh thu món = Tổng thanh toán - Ship (20k)
        // 2. Thực nhận = Doanh thu món * 80% (trừ 20% sàn)
        const SHIPPING_FEE = 20000;
        const revenue = order.total - SHIPPING_FEE;
        const netIncome = revenue > 0 ? revenue * 0.8 : 0;

        return { totalQuantity, netIncome };
    };

    if (!merchant) return <p style={{padding: 20}}>Vui lòng đăng nhập.</p>;

    return (
        <Container>
            <Header>
                <div>
                    <Title>Lịch sử Đơn hàng</Title>
                    <Subtitle>Xem lại các đơn hàng đã hoàn thành hoặc đã hủy.</Subtitle>
                </div>
                <ActionButton onClick={() => alert('Tính năng xuất Excel đang phát triển!')}>
                    <FaFileDownload /> Xuất báo cáo
                </ActionButton>
            </Header>

            <Toolbar>
                <SearchBox>
                    <FaSearch />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã đơn, tên khách hàng..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBox>
                
                <FilterSelect 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="Delivered">Đã giao thành công</option>
                    <option value="Cancelled">Đã hủy / Từ chối</option>
                </FilterSelect>
            </Toolbar>

            <TableWrapper>
                {loading ? (
                    <p style={{padding: 30, textAlign: 'center'}}>Đang tải dữ liệu...</p>
                ) : filteredOrders.length > 0 ? (
                    <Table>
                        <thead>
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Khách hàng</th>
                                <th>Thời gian</th>
                                <th>Món ăn (Tổng SL)</th>
                                <th>Tổng thanh toán</th>
                                <th style={{color: '#f72d57'}}>Thực nhận</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => {
                                const { totalQuantity, netIncome } = calculateMetrics(order);
                                return (
                                    <tr key={order.id}>
                                        <td><strong>#{order.id.substring(0, 6)}</strong></td>
                                        <td>
                                            <div style={{fontWeight: 'bold'}}>{order.userName}</div>
                                            <div style={{fontSize: '0.8rem', color: '#888'}}>{order.userPhone}</div>
                                        </td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>
                                            <div style={{fontWeight: 'bold'}}>{totalQuantity} món</div>
                                            <div style={{fontSize: '0.8rem', color: '#888', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                                {order.items.map(i => `${i.quantity} ${i.name}`).join(', ')}
                                            </div>
                                        </td>
                                        <td style={{fontWeight: 'bold'}}>
                                            {formatCurrency(order.total)}
                                        </td>
                                        <td style={{fontWeight: 'bold', color: '#f72d57'}}>
                                            {order.status === 'Delivered' ? formatCurrency(netIncome) : '0 ₫'}
                                        </td>
                                        <td>
                                            <StatusBadge $status={order.status}>
                                                {order.status === 'Delivered' ? 'Hoàn thành' : 'Đã hủy'}
                                            </StatusBadge>
                                        </td>
                                        <td>
                                            <ActionButton onClick={() => setSelectedOrder(order)}>
                                                <FaEye /> Chi tiết
                                            </ActionButton>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                ) : (
                    <EmptyState>
                        Không tìm thấy đơn hàng nào phù hợp.
                    </EmptyState>
                )}
            </TableWrapper>

            {/* HIỂN THỊ MODAL NẾU CÓ SELECTED ORDER */}
            {selectedOrder && (
                <OrderDetailModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
            )}
        </Container>
    );
};

export default MerchantHistory;