import { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { FaSearch, FaUserSlash, FaUserCheck, FaEnvelope, FaPhone, FaBirthdayCake, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';
import { apiGetUsers, apiUpdateUserStatus, type User } from 'core'; // Đảm bảo import đúng từ core

// === STYLED COMPONENTS ===
const Container = styled.div``;

const Header = styled.div`
    margin-bottom: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
`;

const TitleBlock = styled.div`
    h2 { color: #2c3e50; margin: 0; font-size: 1.8rem; }
    p { color: #7f8c8d; margin: 5px 0 0; font-size: 0.9rem; }
`;

const Controls = styled.div`
    display: flex; gap: 10px;
`;

const SearchBar = styled.div`
    display: flex; align-items: center; background: white; padding: 10px 15px;
    border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); width: 300px;
    border: 1px solid #eee;
    
    input { border: none; outline: none; margin-left: 10px; width: 100%; font-size: 0.9rem; }
    svg { color: #95a5a6; }
`;

const FilterSelect = styled.select`
    padding: 10px 15px; border-radius: 8px; border: 1px solid #eee;
    background: white; outline: none; color: #555; cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
`;

const Grid = styled.div`
    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;
`;

const UserCard = styled.div<{ $blocked?: boolean }>`
    background: white; border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s;
    border-top: 5px solid ${props => props.$blocked ? '#e74c3c' : '#2ecc71'};
    position: relative;

    &:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    
    /* Làm mờ nếu bị khóa để dễ nhận diện */
    ${props => props.$blocked && `
        background-color: #fff5f5;
    `}
`;

const StatusLabel = styled.span<{ $blocked?: boolean }>`
    position: absolute; top: 15px; right: 15px;
    font-size: 0.75rem; font-weight: bold; padding: 4px 8px; border-radius: 4px;
    background: ${props => props.$blocked ? '#e74c3c' : '#e8f5e9'};
    color: ${props => props.$blocked ? 'white' : '#2ecc71'};
`;

const CardHeader = styled.div`
    padding: 20px; display: flex; align-items: center; gap: 15px;
    border-bottom: 1px dashed #eee;
`;

const Avatar = styled.img`
    width: 65px; height: 65px; border-radius: 50%; object-fit: cover;
    border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const UserBasicInfo = styled.div`
    overflow: hidden;
    h4 { margin: 0 0 5px; color: #34495e; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    span { font-size: 0.8rem; color: #95a5a6; display: block; }
`;

const CardBody = styled.div` padding: 20px; `;

const InfoRow = styled.div`
    display: flex; align-items: center; gap: 12px; margin-bottom: 12px; color: #555; font-size: 0.9rem;
    svg { color: #bdc3c7; width: 16px; flex-shrink: 0; }
    span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
`;

const CardFooter = styled.div`
    background: #fcfcfc; padding: 15px 20px; border-top: 1px solid #eee;
    display: flex; gap: 10px;
`;

const Button = styled.button<{ $variant?: 'danger' | 'success' | 'info' }>`
    flex: 1; border: none; border-radius: 6px; padding: 8px; cursor: pointer;
    font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: all 0.2s;
    
    ${props => props.$variant === 'danger' && `
        background: #ffebee; color: #c0392b;
        &:hover { background: #c0392b; color: white; }
    `}
    
    ${props => props.$variant === 'success' && `
        background: #e8f5e9; color: #27ae60;
        &:hover { background: #27ae60; color: white; }
    `}

    ${props => props.$variant === 'info' && `
        background: #e3f2fd; color: #2980b9;
        &:hover { background: #2980b9; color: white; }
    `}
`;

const EmptyState = styled.div`
    text-align: center; padding: 60px; color: #bdc3c7; grid-column: 1 / -1;
    font-size: 1.1rem;
`;

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    // States cho Filter & Search
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'active' | 'blocked'

    // 1. Load dữ liệu
    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await apiGetUsers();
            // Chỉ lấy user có role là 'customer'
            const customers = data.filter((u: any) => u.role === 'customer');
            setUsers(customers);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // 2. Logic Khóa/Mở khóa
    const handleToggleStatus = async (user: User) => {
        const currentStatus = (user as any).status || 'active'; // Mặc định là active nếu db chưa có field này
        const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
        const actionName = newStatus === 'blocked' ? 'KHÓA' : 'MỞ KHÓA';
        
        if (window.confirm(`Xác nhận ${actionName} tài khoản [${user.name}]?\n\nNgười dùng sẽ ${newStatus === 'blocked' ? 'không thể đăng nhập' : 'được phép truy cập lại'}.`)) {
            try {
                // Gọi API cập nhật
                await apiUpdateUserStatus(user.id, newStatus);
                
                // Cập nhật UI ngay lập tức (Optimistic Update)
                setUsers(prev => prev.map(u => 
                    u.id === user.id ? { ...u, status: newStatus } as any : u
                ));
            } catch (error) {
                alert('Lỗi kết nối server!');
            }
        }
    };

    const handleViewHistory = (user: User) => {
        alert(`Tính năng xem lịch sử đơn hàng của ${user.name} đang phát triển!`);
        // Sau này ta sẽ mở một Modal hiển thị danh sách đơn hàng của userId này
    };

    // 3. Logic Filter & Search (Dùng useMemo để tối ưu hiệu năng)
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const u = user as any;
            const currentStatus = u.status || 'active';

            // 1. Lọc theo trạng thái
            if (statusFilter !== 'ALL' && currentStatus !== statusFilter) return false;

            // 2. Lọc theo từ khóa tìm kiếm
            const search = searchTerm.toLowerCase();
            const matchName = user.name?.toLowerCase().includes(search);
            const matchEmail = user.email?.toLowerCase().includes(search);
            const matchPhone = user.tel?.includes(search);

            return matchName || matchEmail || matchPhone;
        });
    }, [users, searchTerm, statusFilter]);

    return (
        <Container>
            {/* Header Area */}
            <Header>
                <TitleBlock>
                    <h2>Quản lý Khách hàng</h2>
                    <p>Danh sách người dùng và trạng thái hoạt động ({users.length})</p>
                </TitleBlock>
                
                <Controls>
                    <FilterSelect 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="blocked">Đã bị khóa</option>
                    </FilterSelect>

                    <SearchBar>
                        <FaSearch />
                        <input 
                            placeholder="Tìm tên, email, sđt..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </SearchBar>
                </Controls>
            </Header>

            {/* Grid Area */}
            {loading ? <p>Đang tải dữ liệu...</p> : (
                <Grid>
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => {
                            const isBlocked = (user as any).status === 'blocked';
                            const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;

                            return (
                                <UserCard key={user.id} $blocked={isBlocked}>
                                    <StatusLabel $blocked={isBlocked}>
                                        {isBlocked ? 'BLOCKED' : 'ACTIVE'}
                                    </StatusLabel>

                                    <CardHeader>
                                        <Avatar src={avatarUrl} alt={user.name} />
                                        <UserBasicInfo>
                                            <h4 title={user.name}>{user.name}</h4>
                                            <span>ID: {user.id}</span>
                                        </UserBasicInfo>
                                    </CardHeader>

                                    <CardBody>
                                        <InfoRow>
                                            <FaEnvelope title="Email" /> 
                                            <span title={user.email}>{user.email}</span>
                                        </InfoRow>
                                        <InfoRow>
                                            <FaPhone title="Số điện thoại" /> 
                                            <span>{user.tel || 'Chưa cập nhật'}</span>
                                        </InfoRow>
                                        <InfoRow>
                                            <FaMapMarkerAlt title="Địa chỉ" /> 
                                            <span>{(user as any).address || 'Chưa có địa chỉ'}</span>
                                        </InfoRow>
                                        <InfoRow>
                                            <FaBirthdayCake title="Ngày sinh" /> 
                                            <span>{(user as any).birthday || '--/--/----'}</span>
                                        </InfoRow>
                                    </CardBody>

                                    <CardFooter>
                                        <Button $variant="info" onClick={() => handleViewHistory(user)}>
                                            <FaHistory /> Lịch sử
                                        </Button>
                                        
                                        <Button 
                                            $variant={isBlocked ? 'success' : 'danger'}
                                            onClick={() => handleToggleStatus(user)}
                                        >
                                            {isBlocked ? <><FaUserCheck /> Mở lại</> : <><FaUserSlash /> Khóa</>}
                                        </Button>
                                    </CardFooter>
                                </UserCard>
                            );
                        })
                    ) : (
                        <EmptyState>
                            Không tìm thấy khách hàng nào khớp với bộ lọc.
                        </EmptyState>
                    )}
                </Grid>
            )}
        </Container>
    );
}