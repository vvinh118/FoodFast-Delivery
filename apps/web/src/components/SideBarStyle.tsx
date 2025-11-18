import styled from 'styled-components';

export const Overlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
    opacity: ${props => (props.$isOpen ? 1 : 0)};
    transition: opacity 0.3s, visibility 0.3s;
`;

// SidebarFrame
export const SidebarFrame = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    width: 560px; /* Chiều rộng mặc định cho Desktop */
    max-width: 100%; /* Đảm bảo không bao giờ tràn */
    height: 100%;
    background: white;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease-out;
    display: flex;
    flex-direction: column;

    /* THÊM MỚI: Media query cho màn hình nhỏ (điện thoại) */
    @media (max-width: 768px) {
        /* * Đặt chiều rộng là 100% hoặc một giá trị nhỏ hơn
         * ví dụ: 90% hoặc 320px
         * Dùng 100% là phổ biến nhất để che toàn bộ màn hình
         */
        width: 100%; 
    }
`;

// SidebarHeader
export const SidebarHeader = styled.div`
    padding: 20px 20px 10px 20px;
    position: relative; 
`;

export const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #666;
    position: absolute; 
    top: 15px;
    left: 15px;
    padding: 0;
    z-index: 1001; 
`;