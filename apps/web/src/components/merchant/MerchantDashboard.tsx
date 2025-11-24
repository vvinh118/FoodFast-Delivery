import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaDollarSign, FaCalendarDay, FaCalendarWeek } from 'react-icons/fa';
import { fetchOrders, useMerchantStore } from 'core';

// === STYLED COMPONENTS ===
const Container = styled.div``;
const Header = styled.div` margin-bottom: 30px; `;
const Title = styled.h1` font-size: 2rem; font-weight: 700; color: #333; margin: 0 0 5px 0; `;
const Subtitle = styled.p` font-size: 1rem; color: #666; margin: 0; `;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
`;

const StatCard = styled.div<{ $color?: string }>`
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 4px solid ${props => props.$color || '#ccc'};
    transition: transform 0.2s;
    
    &:hover { transform: translateY(-3px); }

    .icon-box {
        width: 45px; height: 45px;
        border-radius: 10px;
        background-color: ${props => props.$color ? `${props.$color}15` : '#eee'};
        display: flex; align-items: center; justify-content: center;
        font-size: 1.2rem;
        color: ${props => props.$color || '#555'};
    }
    .content {
        display: flex; flex-direction: column;
        h3 { margin: 0; font-size: 0.85rem; color: #888; font-weight: 500; text-transform: uppercase; }
        p { margin: 5px 0 0; font-size: 1.4rem; font-weight: 700; color: #333; }
    }
`;

const ChartSection = styled.div`
    background: white;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    margin-bottom: 40px;
`;

const ChartHeader = styled.div`
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
    h3 { margin: 0; font-size: 1.1rem; color: #333; }
`;

// Component Biểu đồ SVG đơn giản
const SimpleLineChart = ({ data, color = '#f72d57' }: { data: number[], color?: string }) => {
    const height = 100;
    const width = 100; // 100% viewbox
    const max = Math.max(...data, 1);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (val / max) * height; // Invert Y because SVG coords start top-left
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '200px', overflow: 'visible' }}>
            {/* Đường kẻ ngang tham chiếu */}
            <line x1="0" y1="0" x2="100" y2="0" stroke="#eee" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#eee" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="100" y2="100" stroke="#eee" strokeWidth="0.5" />
            
            {/* Đường biểu đồ */}
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="2"
                points={points}
                vectorEffect="non-scaling-stroke"
            />
            
            {/* Điểm dữ liệu */}
            {data.map((val, i) => {
                const x = (i / (data.length - 1)) * width;
                const y = height - (val / max) * height;
                return (
                    <g key={i}>
                        <circle cx={x} cy={y} r="1.5" fill="white" stroke={color} strokeWidth="0.5" />
                        {/* Tooltip value on hover logic could go here, simplified for now */}
                    </g>
                );
            })}
        </svg>
    );
};

const SectionTitle = styled.h3` font-size: 1.2rem; margin-bottom: 20px; color: #333; `;

const RecentOrdersTable = styled.table`
    width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    th, td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #eee; }
    th { background-color: #f8f9fa; font-weight: 600; color: #555; }
    tr:last-child td { border-bottom: none; }
    .status {
        padding: 5px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
        &.Delivered { background-color: #d4edda; color: #155724; }
        &.Pending { background-color: #fff3cd; color: #856404; }
        &.Cancelled { background-color: #f8d7da; color: #721c24; }
        &.Preparing { background-color: #cce5ff; color: #004085; }
    }
`;

const WeekDays = styled.div`
    display: flex; justify-content: space-between; margin-top: 10px; color: #888; font-size: 0.8rem;
`;

// === HELPER FUNCTIONS ===
const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
};

// === COMPONENT ===
const MerchantDashboard: React.FC = () => {
    const merchant = useMerchantStore(state => state.merchant);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (merchant?.restaurantId) {
            fetchOrders().then(allData => {
                const myOrders = allData.filter((o: any) => 
                    o.items.some((i: any) => String(i.restaurantId) === String(merchant.restaurantId))
                );
                setOrders(myOrders);
                setLoading(false);
            });
        }
    }, [merchant]);

    // === LOGIC TÍNH TOÁN THỐNG KÊ (ĐÃ SỬA) ===
    const stats = useMemo(() => {
        const now = new Date();
        const startOfToday = getStartOfDay(now);
        
        // Lấy ngày thứ 2 đầu tuần (Sửa lại logic một chút cho chuẩn)
        const currentDay = now.getDay(); // 0 là CN, 1 là T2...
        const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const mondayDate = new Date(now);
        mondayDate.setDate(now.getDate() - distanceToMonday);
        const startOfWeek = getStartOfDay(mondayDate);

        const isCompleted = (o: any) => o.status === 'Delivered';

        // HÀM TÍNH THỰC NHẬN (Helper Function)
        const calculateNetIncome = (order: any) => {
            const SHIPPING_FEE = 20000;
            const COMMISSION_RATE = 0.2;
            const revenue = order.total - SHIPPING_FEE;
            return revenue > 0 ? revenue * (1 - COMMISSION_RATE) : 0;
        };

        // 1. Tính Ngày
        const todayOrders = orders.filter(o => getStartOfDay(o.createdAt) === startOfToday);
        // SỬA Ở ĐÂY: Dùng calculateNetIncome thay vì o.total
        const todayRevenue = todayOrders.filter(isCompleted).reduce((sum, o) => sum + calculateNetIncome(o), 0);
        const todayOrderCount = todayOrders.length;

        // 2. Tính Tuần
        const weekOrders = orders.filter(o => getStartOfDay(o.createdAt) >= startOfWeek);
        // SỬA Ở ĐÂY: Dùng calculateNetIncome
        const weekRevenue = weekOrders.filter(isCompleted).reduce((sum, o) => sum + calculateNetIncome(o), 0);
        const weekOrderCount = weekOrders.length;

        // 3. Dữ liệu biểu đồ (7 ngày gần nhất)
        const chartData = [];
        const chartLabels = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStart = getStartOfDay(d);
            
            const dayRevenue = orders
                .filter(o => getStartOfDay(o.createdAt) === dayStart && isCompleted(o))
                .reduce((sum, o) => sum + calculateNetIncome(o), 0); // SỬA Ở ĐÂY LUÔN
            
            chartData.push(dayRevenue);
            chartLabels.push(`${d.getDate()}/${d.getMonth() + 1}`);
        }

        return { todayRevenue, todayOrderCount, weekRevenue, weekOrderCount, chartData, chartLabels };
    }, [orders]);

    const formatCurrency = (val: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

    if (!merchant) return <p style={{padding: 20}}>Vui lòng đăng nhập.</p>;
    if (loading) return <p style={{padding: 20}}>Đang tải...</p>;

    return (
        <Container>
            <Header>
                <Title>Dashboard Tổng quan</Title>
                <Subtitle>Số liệu kinh doanh của quán {merchant.name}</Subtitle>
            </Header>

            {/* 4 THẺ THỐNG KÊ MỚI */}
            <StatsGrid>
                <StatCard $color="#28a745">
                    <div className="icon-box"><FaDollarSign /></div>
                    <div className="content">
                        <h3>Doanh thu hôm nay</h3>
                        <p>{formatCurrency(stats.todayRevenue)}</p>
                    </div>
                </StatCard>
                <StatCard $color="#17a2b8">
                    <div className="icon-box"><FaCalendarDay /></div>
                    <div className="content">
                        <h3>Đơn hàng hôm nay</h3>
                        <p>{stats.todayOrderCount}</p>
                    </div>
                </StatCard>
                <StatCard $color="#fd7e14">
                    <div className="icon-box"><FaDollarSign /></div>
                    <div className="content">
                        <h3>Doanh thu tuần này</h3>
                        <p>{formatCurrency(stats.weekRevenue)}</p>
                    </div>
                </StatCard>
                <StatCard $color="#6f42c1">
                    <div className="icon-box"><FaCalendarWeek /></div>
                    <div className="content">
                        <h3>Đơn hàng tuần này</h3>
                        <p>{stats.weekOrderCount}</p>
                    </div>
                </StatCard>
            </StatsGrid>

            {/* BIỂU ĐỒ TĂNG TRƯỞNG */}
            <ChartSection>
                <ChartHeader>
                    <h3>Biểu đồ doanh thu (7 ngày gần nhất)</h3>
                </ChartHeader>
                
                <SimpleLineChart data={stats.chartData} />
                
                <WeekDays>
                    {stats.chartLabels.map((label, i) => (
                        <span key={i}>{label}</span>
                    ))}
                </WeekDays>
            </ChartSection>

            {/* BẢNG ĐƠN HÀNG */}
            <SectionTitle>Đơn hàng mới nhất</SectionTitle>
            <RecentOrdersTable>
                <thead>
                    <tr>
                        <th>Mã Đơn</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.slice(0, 5).map(order => (
                        <tr key={order.id}>
                            <td>#{order.id.substring(0, 6)}</td>
                            <td>{order.userName}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')} {new Date(order.createdAt).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</td>
                            <td>{formatCurrency(order.total)}</td>
                            <td>
                                <span className={`status ${order.status}`}>{order.status}</span>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{textAlign: 'center', color: '#999'}}>Chưa có đơn hàng nào.</td>
                        </tr>
                    )}
                </tbody>
            </RecentOrdersTable>
        </Container>
    );
};

export default MerchantDashboard;