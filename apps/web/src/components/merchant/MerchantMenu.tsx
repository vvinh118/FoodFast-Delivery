import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { fetchMerchantMenu, addMenuItem, updateMenuItem, deleteMenuItem, useMerchantStore } from 'core';
import Button from '../../components/Button';
import InputField from '../../components/InputField';

// === TYPES ===
interface MenuItem {
    id: string;
    restaurantId: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    isAvailable?: boolean; // Trạng thái còn hàng/hết hàng
}

// === STYLED COMPONENTS ===
const Container = styled.div``;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin: 0;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
`;

const MenuCard = styled.div<{ $isAvailable: boolean }>`
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    overflow: hidden;
    border: 1px solid #eee;
    opacity: ${props => props.$isAvailable ? 1 : 0.6}; /* Làm mờ nếu hết hàng */
    transition: all 0.2s;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
`;

const CardImage = styled.div<{ $src: string }>`
    height: 180px;
    background-image: url(${props => props.$src});
    background-size: cover;
    background-position: center;
    background-color: #f0f0f0;
    position: relative;
`;

const StatusBadge = styled.span<{ $isAvailable: boolean }>`
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: bold;
    color: white;
    background-color: ${props => props.$isAvailable ? '#28a745' : '#dc3545'};
`;

const CardBody = styled.div`
    padding: 15px;
`;

const ItemName = styled.h3`
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 5px 0;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ItemPrice = styled.p`
    font-size: 1rem;
    color: #f72d57;
    font-weight: 700;
    margin: 0 0 10px 0;
`;

const ItemDesc = styled.p`
    font-size: 0.9rem;
    color: #777;
    height: 40px;
    overflow: hidden;
    margin-bottom: 15px;
    line-height: 1.4;
`;

const CardActions = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 10px;
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
`;

const ActionBtn = styled.button<{ $danger?: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 8px;
    border: 1px solid ${props => props.$danger ? '#dc3545' : '#ddd'};
    background: ${props => props.$danger ? '#fff' : '#fff'};
    color: ${props => props.$danger ? '#dc3545' : '#555'};
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s;

    &:hover {
        background: ${props => props.$danger ? '#dc3545' : '#f0f0f0'};
        color: ${props => props.$danger ? '#fff' : '#333'};
    }
`;

// --- MODAL STYLES ---
const Overlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: 999;
    display: flex; justify-content: center; align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const ModalTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #333;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    min-height: 80px;
    font-family: inherit;
    resize: vertical;
    margin-bottom: 20px;
    &:focus { outline: none; border-color: #f72d57; }
`;

const Label = styled.label`
    display: block; font-size: 14px; font-weight: 500; color: #333; margin-bottom: 5px;
`;

// === COMPONENT CHÍNH ===
const MerchantMenu: React.FC = () => {
    const merchant = useMerchantStore(state => state.merchant);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State cho Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        description: '',
        imageUrl: '',
        isAvailable: true
    });

    // Load dữ liệu
    useEffect(() => {
        if (merchant?.restaurantId) {
            loadMenu();
        }
    }, [merchant]);

    const loadMenu = async () => {
        setLoading(true);
        try {
            const items = await fetchMerchantMenu(merchant!.restaurantId);
            // Đảm bảo isAvailable luôn có giá trị (mặc định true nếu db thiếu)
            const processedItems = items.map((i: any) => ({
                ...i,
                isAvailable: i.isAvailable !== false // default true
            }));
            setMenuItems(processedItems);
        } catch (error) {
            console.error("Lỗi tải menu:", error);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý mở form thêm mới
    const handleOpenAdd = () => {
        setFormData({ id: '', name: '', price: '', description: '', imageUrl: '', isAvailable: true });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    // Xử lý mở form sửa
    const handleOpenEdit = (item: MenuItem) => {
        setFormData({
            id: item.id,
            name: item.name,
            price: item.price.toString(),
            description: item.description,
            imageUrl: item.imageUrl,
            isAvailable: item.isAvailable !== false
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    // Xử lý Submit Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!merchant?.restaurantId) return;

        const itemData = {
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            imageUrl: formData.imageUrl,
            restaurantId: merchant.restaurantId, // ID quán
            isAvailable: formData.isAvailable
        };

        try {
            if (isEditing) {
                await updateMenuItem(formData.id, itemData);
            } else {
                await addMenuItem(itemData);
            }
            await loadMenu(); // Reload lại danh sách
            setIsModalOpen(false);
        } catch (error) {
            alert("Có lỗi xảy ra!");
        }
    };

    // Xử lý xóa
    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc muốn xóa món này không?")) {
            try {
                await deleteMenuItem(id);
                loadMenu();
            } catch (error) {
                alert("Không thể xóa món ăn này.");
            }
        }
    };

    // Xử lý toggle "Hết hàng" / "Còn hàng"
    const handleToggleStatus = async (item: MenuItem) => {
        const newStatus = !item.isAvailable;
        try {
            // Cập nhật state UI ngay lập tức cho mượt
            setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, isAvailable: newStatus } : i));
            // Gọi API
            await updateMenuItem(item.id, { isAvailable: newStatus });
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái");
            loadMenu(); // Revert nếu lỗi
        }
    };

    if (!merchant) return <p>Vui lòng đăng nhập.</p>;

    return (
        <Container>
            <Header>
                <div>
                    <Title>Quản lý Thực đơn</Title>
                    <p style={{color: '#666'}}>Danh sách các món ăn đang bán tại nhà hàng.</p>
                </div>
                <Button onClick={handleOpenAdd}>
                    <FaPlus style={{marginRight: 5}} /> Thêm món mới
                </Button>
            </Header>

            {loading ? <p>Đang tải...</p> : (
                <Grid>
                    {menuItems.map(item => (
                        <MenuCard key={item.id} $isAvailable={!!item.isAvailable}>
                            <CardImage $src={item.imageUrl}>
                                <StatusBadge $isAvailable={!!item.isAvailable}>
                                    {item.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                                </StatusBadge>
                            </CardImage>
                            <CardBody>
                                <ItemName>{item.name}</ItemName>
                                <ItemPrice>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</ItemPrice>
                                <ItemDesc>{item.description}</ItemDesc>
                                
                                <CardActions>
                                    {/* Nút Toggle Trạng thái */}
                                    <ActionBtn onClick={() => handleToggleStatus(item)}>
                                        {item.isAvailable ? 'Báo hết hàng' : 'Mở bán lại'}
                                    </ActionBtn>
                                    
                                    {/* Nút Sửa */}
                                    <ActionBtn onClick={() => handleOpenEdit(item)}>
                                        <FaEdit /> Sửa
                                    </ActionBtn>
                                    
                                    {/* Nút Xóa */}
                                    <ActionBtn $danger onClick={() => handleDelete(item.id)}>
                                        <FaTrash />
                                    </ActionBtn>
                                </CardActions>
                            </CardBody>
                        </MenuCard>
                    ))}
                </Grid>
            )}

            {/* MODAL FORM */}
            {isModalOpen && (
                <Overlay onClick={() => setIsModalOpen(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <ModalTitle>{isEditing ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}</ModalTitle>
                        <form onSubmit={handleSubmit}>
                            <InputField 
                                label="Tên món" id="name" type="text" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                placeholder="VD: Cơm gà..."
                            />
                            <InputField 
                                label="Giá (VNĐ)" id="price" type="text" 
                                value={formData.price} 
                                onChange={e => setFormData({...formData, price: e.target.value})} 
                                placeholder="VD: 45000"
                            />
                            <InputField 
                                label="Link hình ảnh (URL)" id="imageUrl" type="text" 
                                value={formData.imageUrl} 
                                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                                placeholder="https://..."
                            />
                            
                            <div style={{marginBottom: 20}}>
                                <Label>Mô tả</Label>
                                <TextArea 
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    placeholder="Mô tả chi tiết về món ăn..."
                                />
                            </div>

                            <ButtonGroup>
                                <Button 
                                    type="button" 
                                    $background="#eee" $color="#333" $hoverBackground="#ddd"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </Button>
                                <Button type="submit">
                                    {isEditing ? 'Lưu thay đổi' : 'Tạo món'}
                                </Button>
                            </ButtonGroup>
                        </form>
                    </ModalContent>
                </Overlay>
            )}
        </Container>
    );
};

export default MerchantMenu;