import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    /* Định nghĩa font Milestone Script */
    @font-face {
        font-family: 'MilestoneScript'; 
        /* Sử dụng đường dẫn tuyệt đối từ public */
        src: url('/fonts/Milestone-Script-chalos.ttf') format('truetype'); 
        font-weight: normal;
        font-style: normal;
        font-display: swap; 
    }

    body {
        font-family: 'Poppins', sans-serif;
    }
`;

export default GlobalStyle;