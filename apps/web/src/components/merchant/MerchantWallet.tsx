import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useMerchantStore, fetchOrders } from 'core';
import { FaWallet, FaHistory, FaUniversity, FaArrowUp, FaClock, FaCheckCircle } from 'react-icons/fa';
import Button from '../../components/Button';

// === STYLED COMPONENTS ===
const Container = styled.div` max-width: 1000px; margin: 0 auto; `;
const Header = styled.div` margin-bottom: 30px; `;
const Title = styled.h1` font-size: 2rem; font-weight: 700; color: #333; margin: 0 0 5px 0; `;
const Subtitle = styled.p` font-size: 1rem; color: #666; margin: 0; `;

const WalletGrid = styled.div`
    display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; margin-bottom: 40px;
    @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const BankCard = styled.div`
    background: linear-gradient(135deg, #f72d57 0%, #ff5b7a 100%);
    border-radius: 20px; padding: 25px; color: white;
    box-shadow: 0 10px 25px rgba(247, 45, 87, 0.3); position: relative; height: 220px;
    display: flex; flex-direction: column; justify-content: space-between; overflow: hidden;
    &::before { content: ''; position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 50%; }
    &::after { content: ''; position: absolute; bottom: -50%; left: -10%; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%; }
`;

const CardTop = styled.div` display: flex; justify-content: space-between; align-items: center; z-index: 1; `;
const CardLabel = styled.span` font-size: 0.9rem; opacity: 0.9; letter-spacing: 1px; text-transform: uppercase; `;
const CardChip = styled.div` width: 40px; height: 25px; background: linear-gradient(135deg, #ffeb3b 0%, #fbc02d 100%); border-radius: 4px; `;
const Balance = styled.h2` font-size: 2.5rem; font-weight: 700; margin: 0; z-index: 1; letter-spacing: 1px; `;
const CardBottom = styled.div` display: flex; justify-content: space-between; align-items: flex-end; z-index: 1; `;
const CardName = styled.div` font-size: 1.1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; `;
const BrandLogo = styled.div` font-size: 1.5rem; font-weight: bold; font-style: italic; opacity: 0.8; `;

const PendingBalance = styled.div`
    font-size: 0.9rem; background: rgba(0,0,0,0.2); padding: 5px 12px; border-radius: 8px;
    display: inline-block; margin-top: 5px; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.2);
    span { font-weight: bold; color: #ffeb3b; } /* Màu vàng nổi bật cho số tiền chờ */
`;

const ActionCard = styled.div`
    background: white; border-radius: 12px; padding: 30px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; justify-content: center;
`;
const ActionRow = styled.div` display: flex; gap: 20px; margin-top: 20px; button { flex: 1; } `;

const HistorySection = styled.div` background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); `;
const HistoryHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; `;
const HistoryTitle = styled.h3` font-size: 1.2rem; margin: 0; color: #333; display: flex; align-items: center; gap: 10px; `;

const FilterSelect = styled.select`
    padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; 
    outline: none; font-size: 0.9rem; color: #555; background: white; cursor: pointer;
`;

const TransactionItem = styled.div`
    display: flex; justify-content: space-between; align-items: center;
    padding: 15px 0; border-bottom: 1px solid #eee;
    &:last-child { border-bottom: none; }
`;
const TransInfo = styled.div` display: flex; flex-direction: column; gap: 4px; `;
const TransTitle = styled.div` font-weight: 600; color: #333; font-size: 1rem; `;
const TransTime = styled.div` font-size: 0.85rem; color: #888; display: flex; align-items: center; gap: 5px;`;

// === SỬA STYLE SỐ TIỀN (Màu sắc động) ===
const TransAmount = styled.div<{ $isPending: boolean }>`
    font-weight: 700;
    font-size: 1rem;
    display: flex; align-items: center; gap: 6px;
    /* Nếu pending thì màu cam, nếu đã cộng thì màu xanh */
    color: ${props => props.$isPending ? '#f0ad4e' : '#28a745'};
`;

const StatusTag = styled.span<{ $isPending: boolean }>`
    font-size: 0.75rem; padding: 2px 6px; border-radius: 4px;
    background-color: ${props => props.$isPending ? '#fff3cd' : '#d4edda'};
    color: ${props => props.$isPending ? '#856404' : '#155724'};
    border: 1px solid ${props => props.$isPending ? '#ffeeba' : '#c3e6cb'};
`;

const DateGroupHeader = styled.div`
    margin-top: 25px; margin-bottom: 10px; font-size: 0.9rem; font-weight: 700; color: #555;
    background-color: #f8f9fa; padding: 8px 15px; border-radius: 6px; border-left: 4px solid #f72d57;
    text-transform: uppercase;
`;

// === COMPONENT ===
const MerchantWallet: React.FC = () => {
    const merchant = useMerchantStore(state => state.merchant);
    
    const [availableBalance, setAvailableBalance] = useState(0);
    const [pendingBalance, setPendingBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [filterType, setFilterType] = useState('ALL'); 

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return `${d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}`;
    };

    const getFriendlyDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        date.setHours(0,0,0,0);
        today.setHours(0,0,0,0);
        yesterday.setHours(0,0,0,0);

        if (date.getTime() === today.getTime()) return "Hôm nay";
        if (date.getTime() === yesterday.getTime()) return "Hôm qua";
        return `Ngày ${date.toLocaleDateString('vi-VN')}`;
    };

    const isWithinFilter = (dateStr: string, type: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        if (type === 'TODAY') return date >= startOfDay;
        if (type === 'WEEK') {
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 
            return date >= startOfWeek;
        }
        if (type === 'MONTH') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return date >= startOfMonth;
        }
        return true;
    };

    useEffect(() => {
        if (!merchant?.restaurantId) return;

        const loadHistory = async () => {
            try {
                const allOrders = await fetchOrders();
                
                const myCompletedOrders = allOrders.filter((order: any) => 
                    order.status === 'Delivered' &&
                    order.items.some((item: any) => String(item.restaurantId) === String(merchant.restaurantId))
                );

                let calcAvailable = 0;
                let calcPending = 0;
                const transList: any[] = [];
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                myCompletedOrders.forEach((order: any) => {
                    const SHIPPING_FEE = 20000;
                    const revenue = order.total - SHIPPING_FEE;
                    const netIncome = revenue > 0 ? revenue * 0.8 : 0; 

                    const orderDate = new Date(order.createdAt);
                    const orderDateOnly = new Date(order.createdAt);
                    orderDateOnly.setHours(0, 0, 0, 0);

                    // XÁC ĐỊNH TRẠNG THÁI TIỀN
                    const isPending = orderDateOnly.getTime() >= today.getTime();

                    if (isPending) {
                        calcPending += netIncome;
                    } else {
                        calcAvailable += netIncome;
                    }

                    transList.push({
                        id: order.id,
                        title: `Thu nhập đơn #${order.id.substring(0, 6)}`,
                        time: order.createdAt,
                        dateGroup: orderDateOnly.toISOString(),
                        amount: netIncome,
                        isPending: isPending // Lưu trạng thái vào đây để dùng khi render
                    });
                });

                setAvailableBalance(calcAvailable);
                setPendingBalance(calcPending);
                setTransactions(transList);

            } catch (err) {
                console.error("Lỗi tải ví:", err);
            }
        };

        loadHistory();
    }, [merchant?.restaurantId]);

    // Logic nhóm và sort (như cũ)
    const groupedTransactions = useMemo(() => {
        const filtered = transactions.filter(t => isWithinFilter(t.time, filterType));
        const groups: Record<string, any[]> = {};
        filtered.forEach(t => {
            const dateKey = t.dateGroup;
            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(t);
        });

        const sortedGroupKeys = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        const sortedGroupsResult: { title: string, items: any[] }[] = [];
        
        sortedGroupKeys.forEach(key => {
            const items = groups[key].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
            sortedGroupsResult.push({
                title: getFriendlyDate(key),
                items: items
            });
        });

        return sortedGroupsResult;
    }, [transactions, filterType]);


    if (!merchant) return <p>Vui lòng đăng nhập.</p>;

    return (
        <Container>
            <Header>
                <Title>Ví Doanh Thu</Title>
                <Subtitle>Quản lý dòng tiền và rút tiền về tài khoản.</Subtitle>
            </Header>

            <WalletGrid>
                <BankCard>
                    <CardTop>
                        <CardLabel>FoodFast Wallet</CardLabel>
                        <CardChip />
                    </CardTop>
                    <div style={{zIndex: 1}}>
                        <CardLabel style={{fontSize: '0.8rem', opacity: 0.8}}>Số dư khả dụng</CardLabel>
                        <Balance>{formatCurrency(availableBalance)}</Balance>
                        
                        {pendingBalance > 0 && (
                            <PendingBalance>
                                Chờ duyệt: <span>+{formatCurrency(pendingBalance)}</span>
                            </PendingBalance>
                        )}
                    </div>
                    <CardBottom>
                        <CardName>{merchant.name}</CardName>
                        <BrandLogo>MERCHANT</BrandLogo>
                    </CardBottom>
                </BankCard>

                <ActionCard>
                    <h3>Thao tác nhanh</h3>
                    <p style={{color: '#666', lineHeight: '1.6'}}>
                        Doanh thu hôm nay sẽ ở trạng thái <b>Chờ duyệt</b> và tự động cộng vào số dư khả dụng vào 00:00 ngày hôm sau.
                    </p>
                    <ActionRow>
                        <Button onClick={() => alert("Tính năng Rút tiền đang phát triển")} $width="100%">
                            <FaUniversity style={{marginRight: 8}} /> Rút tiền
                        </Button>
                        <Button onClick={() => alert("Đang phát triển")} $width="100%" $variant="secondary" $background="#eee" $color="#333">
                            <FaHistory style={{marginRight: 8}} /> Xuất sao kê
                        </Button>
                    </ActionRow>
                </ActionCard>
            </WalletGrid>

            <HistorySection>
                <HistoryHeader>
                    <HistoryTitle><FaHistory /> Lịch sử thu nhập thực nhận</HistoryTitle>
                    <FilterSelect value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="ALL">Tất cả</option>
                        <option value="TODAY">Hôm nay</option>
                        <option value="WEEK">Tuần này</option>
                        <option value="MONTH">Tháng này</option>
                    </FilterSelect>
                </HistoryHeader>

                {groupedTransactions.length > 0 ? (
                    groupedTransactions.map((group, index) => (
                        <div key={index}>
                            <DateGroupHeader>{group.title}</DateGroupHeader>
                            
                            {group.items.map(trans => (
                                <TransactionItem key={trans.id}>
                                    <TransInfo>
                                        <TransTitle>{trans.title}</TransTitle>
                                        <TransTime>
                                            {/* Hiển thị tag trạng thái nhỏ bên cạnh giờ */}
                                            {formatDate(trans.time)}
                                            <span style={{margin: '0 5px', color: '#ddd'}}>|</span>
                                            <StatusTag $isPending={trans.isPending}>
                                                {trans.isPending ? 'Chờ duyệt' : 'Đã cộng ví'}
                                            </StatusTag>
                                        </TransTime>
                                    </TransInfo>
                                    
                                    {/* SỐ TIỀN ĐỔI MÀU DỰA VÀO TRẠNG THÁI */}
                                    <TransAmount $isPending={trans.isPending}>
                                        {trans.isPending ? <FaClock size={12} /> : <FaCheckCircle size={12} />} 
                                        +{formatCurrency(trans.amount)}
                                    </TransAmount>
                                </TransactionItem>
                            ))}
                        </div>
                    ))
                ) : (
                    <p style={{color: '#999', fontStyle: 'italic', textAlign: 'center', padding: '20px'}}>
                        Không có giao dịch nào trong khoảng thời gian này.
                    </p>
                )}
            </HistorySection>
        </Container>
    );
};

export default MerchantWallet;