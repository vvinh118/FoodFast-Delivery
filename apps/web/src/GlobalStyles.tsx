import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'MilestoneScript'; 
        src: url('/fonts/Milestone-Script-chalos.ttf') format('truetype'); 
        font-weight: normal;
        font-style: normal;
        font-display: swap; 
    }
    
    @font-face {
        font-family: 'VLANGELLINE'; 
        src: url('/fonts/VLANGELLINE.ttf') format('truetype'); 
        font-weight: normal;
        font-style: normal;
        font-display: swap; 
    }

    body {
        font-family: 'Poppins', sans-serif;
    }

    //h1, h2,  {
        font-family: 'MilestoneScript', cursive; 
        font-weight: normal; 
    }
`;

export default GlobalStyle;