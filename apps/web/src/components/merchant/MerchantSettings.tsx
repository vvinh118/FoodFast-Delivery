import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSave, FaStore, FaClock, FaMapMarkerAlt, FaPowerOff } from 'react-icons/fa';
import { fetchRestaurantDetail, updateRestaurant, useMerchantStore } from 'core';
import InputField from '../../components/InputField';
import Button from '../../components/Button';

// === STYLED COMPONENTS ===
const Container = styled.div`
    max-width: 800px;
    margin: 0 auto;
`;

const Header = styled.div`
    margin-bottom: 30px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
    font-size: 1rem;
    color: #666;
    margin: 0;
`;

const Card = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    padding: 30px;
    margin-bottom: 30px;
`;

const SectionTitle = styled.h3`
    font-size: 1.2rem;
    color: #333;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    
    svg { color: #f72d57; }
`;

const Row = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
    
    > div { flex: 1; } /* InputField sẽ chiếm đều không gian */
`;

// Toggle Switch Style
const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #eee;
`;

const SwitchLabel = styled.div`
    display: flex;
    flex-direction: column;
    
    strong { font-size: 1rem; color: #333; margin-bottom: 5px; }
    span { font-size: 0.9rem; color: #666; }
`;

const SwitchInput = styled.input`
    position: relative;
    width: 60px;
    height: 34px;
    appearance: none;
    background: #ccc;
    border-radius: 34px;
    transition: 0.3s;
    cursor: pointer;
    outline: none;

    &:checked {
        background: #28a745; /* Màu xanh khi mở */
    }

    &::before {
        content: '';
        position: absolute;
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background: white;
        border-radius: 50%;
        transition: 0.3s;
    }

    &:checked::before {
        transform: translateX(26px);
    }
`;

const StatusBadge = styled.span<{ $isOpen: boolean }>`
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: bold;
    color: white;
    background-color: ${props => props.$isOpen ? '#28a745' : '#dc3545'};
    margin-left: 10px;
`;

// === COMPONENT ===
const MerchantSettings: React.FC = () => {
    const merchant = useMerchantStore(state => state.merchant);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [info, setInfo] = useState({
        name: '',
        address: '',
        imageUrl: '',
        openingTime: '07:00',
        closingTime: '22:00',
        isAcceptingOrders: true
    });

    // 1. Load thông tin hiện tại
    useEffect(() => {
        if (merchant?.restaurantId) {
            fetchRestaurantDetail(merchant.restaurantId)
                .then(data => {
                    setInfo({
                        name: data.name || '',
                        address: data.address || '',
                        imageUrl: data.imageUrl || '',
                        openingTime: data.openingTime || '07:00',
                        closingTime: data.closingTime || '22:00',
                        isAcceptingOrders: data.isAcceptingOrders !== false 
                    });
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [merchant]);

    // 2. Xử lý bật/tắt trạng thái quán (GỌI API NGAY LẬP TỨC)
    const handleToggleStatus = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!merchant?.restaurantId) return;
        
        const newStatus = e.target.checked;
        
        // A. Cập nhật UI ngay cho mượt (Optimistic UI)
        setInfo(prev => ({ ...prev, isAcceptingOrders: newStatus }));

        try {
            // B. Gọi API cập nhật Database ngay lập tức
            // Chỉ gửi trường isAcceptingOrders để tiết kiệm băng thông
            await updateRestaurant(merchant.restaurantId, { isAcceptingOrders: newStatus });
            console.log("Đã cập nhật trạng thái quán thành:", newStatus);
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
            // C. Nếu lỗi thì hoàn tác UI
            setInfo(prev => ({ ...prev, isAcceptingOrders: !newStatus }));
        }
    };

    // 3. Xử lý lưu các thông tin còn lại (Khi bấm nút Lưu)
    const handleSaveInfo = async () => {
        if (!merchant?.restaurantId) return;
        setSaving(true);
        try {
            // Gửi toàn bộ thông tin (trừ isAcceptingOrders đã xử lý riêng, nhưng gửi đè cũng không sao)
            await updateRestaurant(merchant.restaurantId, info);
            alert("Đã lưu thông tin cửa hàng thành công!");
        } catch (error) {
            alert("Có lỗi xảy ra khi lưu thông tin.");
        } finally {
            setSaving(false);
        }
    };

    if (!merchant) return <p style={{padding: 20}}>Vui lòng đăng nhập.</p>;
    if (loading) return <p style={{padding: 20}}>Đang tải cài đặt...</p>;

    return (
        <Container>
            <Header>
                <Title>Cài đặt Cửa hàng</Title>
                <Subtitle>Quản lý thông tin hiển thị và trạng thái hoạt động.</Subtitle>
            </Header>

            {/* TRẠNG THÁI HOẠT ĐỘNG (GỌI API NGAY KHI CLICK) */}
            <Card style={{ borderTop: `4px solid ${info.isAcceptingOrders ? '#28a745' : '#dc3545'}` }}>
                <SectionTitle>
                    <FaPowerOff /> Trạng thái Nhà hàng
                    <StatusBadge $isOpen={info.isAcceptingOrders}>
                        {info.isAcceptingOrders ? 'ĐANG MỞ CỬA' : 'TẠM ĐÓNG'}
                    </StatusBadge>
                </SectionTitle>
                
                <SwitchContainer>
                    <SwitchLabel>
                        <strong>Nhận đơn hàng mới</strong>
                        <span>Tắt nút này nếu quán đang quá tải hoặc nghỉ đột xuất. Khách hàng sẽ thấy quán "Tạm đóng".</span>
                    </SwitchLabel>
                    <SwitchInput 
                        type="checkbox" 
                        checked={info.isAcceptingOrders}
                        onChange={handleToggleStatus} // <-- SỬ DỤNG HÀM MỚI TẠI ĐÂY
                    />
                </SwitchContainer>
            </Card>

            {/* THÔNG TIN CƠ BẢN */}
            <Card>
                <SectionTitle><FaStore /> Thông tin cơ bản</SectionTitle>
                <InputField 
                    label="Tên cửa hàng" id="name" type="text" 
                    value={info.name} 
                    onChange={e => setInfo({...info, name: e.target.value})}
                />
                <InputField 
                    label="Địa chỉ hiển thị" id="address" type="text" 
                    value={info.address} 
                    onChange={e => setInfo({...info, address: e.target.value})}
                />
                <InputField 
                    label="Link ảnh bìa / Logo" id="imageUrl" type="text" 
                    value={info.imageUrl} 
                    onChange={e => setInfo({...info, imageUrl: e.target.value})}
                />
            </Card>

            {/* GIỜ HOẠT ĐỘNG */}
            <Card>
                <SectionTitle><FaClock /> Giờ hoạt động (Tự động)</SectionTitle>
                <p style={{color: '#666', fontSize: '0.9rem', marginBottom: '20px'}}>
                    Hệ thống sẽ tự động từ chối đơn hàng nếu khách đặt ngoài khung giờ này.
                </p>
                <Row>
                    <InputField 
                        label="Giờ mở cửa" id="openTime" type="time" 
                        value={info.openingTime} 
                        onChange={e => setInfo({...info, openingTime: e.target.value})}
                    />
                    <InputField 
                        label="Giờ đóng cửa" id="closeTime" type="time" 
                        value={info.closingTime} 
                        onChange={e => setInfo({...info, closingTime: e.target.value})}
                    />
                </Row>
            </Card>

            {/* NÚT LƯU (CHỈ LƯU THÔNG TIN VÀ GIỜ) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    onClick={handleSaveInfo} 
                    disabled={saving}
                    $padding="15px 40px"
                    $fontSize="1.1rem"
                >
                    <FaSave style={{marginRight: 8}} />
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </div>

        </Container>
    );
};

export default MerchantSettings;