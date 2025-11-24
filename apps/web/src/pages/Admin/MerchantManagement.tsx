import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaCheck, FaLock, FaPlus, FaStore, FaTimes, FaUnlock } from 'react-icons/fa';
import { 
    apiGetAllRestaurants, 
    apiGetUsers, 
    apiUpdateRestaurant, 
    apiRegister, 
    apiCreateRestaurant,
    type Restaurant, 
    type User 
} from 'core';

// =========================================================
// STYLED COMPONENTS
// =========================================================
const Container = styled.div` padding: 20px; `;

const Header = styled.div`
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
`;
const Title = styled.h2` margin: 0; color: #2c3e50; `;

const AddButton = styled.button`
    background-color: #F72D57; color: white; border: none; padding: 12px 20px;
    border-radius: 6px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px;
    &:hover { background-color: #d6284b; }
`;

// --- TABS ---
const TabsContainer = styled.div`
    display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #eee;
`;
const TabButton = styled.button<{ $isActive: boolean }>`
    background: none; border: none; padding: 10px 20px; cursor: pointer;
    font-weight: 600; color: ${props => props.$isActive ? '#F72D57' : '#7f8c8d'};
    border-bottom: 2px solid ${props => props.$isActive ? '#F72D57' : 'transparent'};
    transition: all 0.2s;
    &:hover { color: #F72D57; }
`;

const Table = styled.table`
    width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;
const Th = styled.th` text-align: left; padding: 15px; background: #ecf0f1; color: #7f8c8d; text-transform: uppercase; font-size: 0.85rem; `;
const Td = styled.td` padding: 15px; border-bottom: 1px solid #eee; color: #333; vertical-align: middle; `;

const ActionBtn = styled.button<{ $color: string }>`
    background: none; border: 1px solid ${props => props.$color}; color: ${props => props.$color};
    padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-right: 5px;
    transition: all 0.2s; display: inline-flex; align-items: center; gap: 5px;
    &:hover { background: ${props => props.$color}; color: white; }
`;

const EmptyState = styled.div`
    text-align: center; padding: 40px; color: #999; background: white; border-radius: 8px; margin-top: 20px;
`;

// --- MODAL STYLES --- (Giữ nguyên như cũ)
const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
`;
const ModalContent = styled.div`
    background: white; padding: 30px; border-radius: 10px; width: 500px; max-width: 90%;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
`;
const FormGroup = styled.div` margin-bottom: 15px; label { display: block; margin-bottom: 5px; font-weight: 500; } input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; } `;
const ModalActions = styled.div` display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; `;

// =========================================================
// COMPONENT CHÍNH
// =========================================================
export default function MerchantManagement() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // State cho Tabs: 'active' | 'pending' | 'suspended'
    const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'suspended'>('active');

    // State cho form tạo mới
    const [newMerchant, setNewMerchant] = useState({
        email: '', password: '', name: '', restaurantName: '', tel: ''
    });

    const loadData = async () => {
        try {
            const [resData, userData] = await Promise.all([ 
                apiGetAllRestaurants(), 
                apiGetUsers() 
            ]);
            setRestaurants(resData);
            setUsers(userData as User[]);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    // Lọc danh sách theo Tab
    const filteredRestaurants = useMemo(() => {
        return restaurants.filter(res => (res.status || 'pending') === activeTab);
    }, [restaurants, activeTab]);

    const handleStatusChange = async (restaurant: Restaurant, newStatus: 'active' | 'suspended') => {
        const actionName = newStatus === 'active' ? 'KÍCH HOẠT' : 'KHÓA';
        if (!confirm(`Bạn có chắc muốn ${actionName} quán này?`)) return;
        try {
            await apiUpdateRestaurant(restaurant.id, { status: newStatus });
            loadData(); 
        } catch (err) { alert("Có lỗi xảy ra"); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userPayload = {
                email: newMerchant.email, password: newMerchant.password, name: newMerchant.name, role: 'merchant', tel: newMerchant.tel
            };
            const createdUser: User = await apiRegister(userPayload);

            const restaurantPayload = {
                id: Date.now().toString(),
                ownerId: createdUser.id,
                name: newMerchant.restaurantName,
                address: "Chưa cập nhật địa chỉ",
                rating: 5.0, deliveryTime: 30, distance: 1,
                imageUrl: "https://placehold.co/600x400/png?text=New+Restaurant",
                category: "Chưa phân loại", isPromo: false, status: "pending"
            };
            await apiCreateRestaurant(restaurantPayload);
            alert("Cấp tài khoản thành công!");
            setShowModal(false);
            setNewMerchant({ email: '', password: '', name: '', restaurantName: '', tel: '' });
            loadData();
        } catch (err: any) { alert("Lỗi: " + err.message); }
    };

    const getOwnerName = (ownerId?: string | number) => {
        const owner = users.find(u => u.id == ownerId);
        return owner ? owner.name : 'Không xác định';
    };

    // Render nội dung bảng theo tab
    const renderTableContent = () => {
        if (loading) return <p>Đang tải...</p>;
        if (filteredRestaurants.length === 0) return <EmptyState>Không có nhà hàng nào trong mục này.</EmptyState>;

        return (
            <Table>
                <thead>
                    <tr>
                        <Th>Tên Nhà Hàng</Th>
                        <Th>Chủ Quán</Th>
                        <Th>Địa chỉ</Th>
                        <Th style={{textAlign: 'right'}}>Hành động</Th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRestaurants.map(res => (
                        <tr key={res.id}>
                            <Td>
                                <div style={{fontWeight: 'bold'}}>{res.name}</div>
                                <div style={{fontSize: '0.8rem', color: '#999'}}>ID: {res.id}</div>
                            </Td>
                            <Td>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <FaStore color="#7f8c8d"/> {getOwnerName(res.ownerId)}
                                </div>
                            </Td>
                            <Td>{res.address}</Td>
                            <Td style={{textAlign: 'right'}}>
                                {/* Nút bấm thay đổi tùy theo Tab */}
                                {activeTab === 'pending' && (
                                    <ActionBtn $color="#2ecc71" onClick={() => handleStatusChange(res, 'active')}>
                                        <FaCheck /> Duyệt ngay
                                    </ActionBtn>
                                )}
                                {activeTab === 'active' && (
                                    <ActionBtn $color="#e74c3c" onClick={() => handleStatusChange(res, 'suspended')}>
                                        <FaLock /> Khóa
                                    </ActionBtn>
                                )}
                                {activeTab === 'suspended' && (
                                    <ActionBtn $color="#2ecc71" onClick={() => handleStatusChange(res, 'active')}>
                                        <FaUnlock /> Mở khóa
                                    </ActionBtn>
                                )}
                            </Td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        );
    }

    return (
        <Container>
            <Header>
                <Title>Quản lý Đối tác Nhà hàng</Title>
                <AddButton onClick={() => setShowModal(true)}>
                    <FaPlus /> Cấp tài khoản mới
                </AddButton>
            </Header>

            {/* TABS */}
            <TabsContainer>
                <TabButton $isActive={activeTab === 'active'} onClick={() => setActiveTab('active')}>
                    Đang hoạt động ({restaurants.filter(r => r.status === 'active').length})
                </TabButton>
                <TabButton $isActive={activeTab === 'pending'} onClick={() => setActiveTab('pending')}>
                    Chờ duyệt ({restaurants.filter(r => (r.status || 'pending') === 'pending').length})
                </TabButton>
                <TabButton $isActive={activeTab === 'suspended'} onClick={() => setActiveTab('suspended')}>
                    Tạm ngưng ({restaurants.filter(r => r.status === 'suspended').length})
                </TabButton>
            </TabsContainer>

            {renderTableContent()}

            {/* MODAL TẠO MỚI (Giữ nguyên) */}
            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        {/* ... (Giữ nguyên nội dung Modal như bài trước) ... */}
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                            <h3>Cấp tài khoản Merchant mới</h3>
                            <button onClick={() => setShowModal(false)} style={{border:'none', background:'none', cursor:'pointer', fontSize:'1.2rem'}}><FaTimes/></button>
                        </div>
                        <form onSubmit={handleCreate}>
                            <FormGroup>
                                <label>Tên chủ quán</label>
                                <input required type="text" placeholder="Ví dụ: Nguyễn Văn A" 
                                    value={newMerchant.name} onChange={e => setNewMerchant({...newMerchant, name: e.target.value})} />
                            </FormGroup>
                            <FormGroup>
                                <label>Số điện thoại</label>
                                <input required type="text" placeholder="0909..." 
                                    value={newMerchant.tel} onChange={e => setNewMerchant({...newMerchant, tel: e.target.value})} />
                            </FormGroup>
                            <FormGroup>
                                <label>Email đăng nhập (Cấp phát)</label>
                                <input required type="email" placeholder="merchant@foodfast.vn" 
                                    value={newMerchant.email} onChange={e => setNewMerchant({...newMerchant, email: e.target.value})} />
                            </FormGroup>
                            <FormGroup>
                                <label>Mật khẩu mặc định</label>
                                <input required type="text" placeholder="123456" 
                                    value={newMerchant.password} onChange={e => setNewMerchant({...newMerchant, password: e.target.value})} />
                            </FormGroup>
                            <FormGroup>
                                <label>Tên quán dự kiến</label>
                                <input required type="text" placeholder="Ví dụ: Cơm Tấm Sài Gòn" 
                                    value={newMerchant.restaurantName} onChange={e => setNewMerchant({...newMerchant, restaurantName: e.target.value})} />
                            </FormGroup>
                            <ModalActions>
                                <button type="button" onClick={() => setShowModal(false)} style={{padding:'10px 20px', border:'1px solid #ddd', background:'white', borderRadius:'5px', cursor:'pointer'}}>Hủy</button>
                                <button type="submit" style={{padding:'10px 20px', border:'none', background:'#F72D57', color:'white', borderRadius:'5px', cursor:'pointer', fontWeight:'bold'}}>Tạo tài khoản</button>
                            </ModalActions>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
}