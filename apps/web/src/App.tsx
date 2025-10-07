// apps/web/src/App.tsx

import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

// Đảm bảo đã xóa: import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    // DIV bao ngoài cùng: Áp dụng nền tối, căn giữa toàn màn hình
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8"> 
      
      {/* Logos: Dùng flex và spacing */}
      <div className="flex space-x-8 mb-10"> 
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          {/* Logo với kích thước Tailwind */}
          <img src={viteLogo} className="w-24 h-24 hover:scale-110 transition-transform duration-300" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          {/* Logo với class Tailwind */}
          <img src={reactLogo} className="w-24 h-24 animate-spin-slow hover:opacity-75 transition-opacity duration-300" alt="React logo" />
        </a>
      </div>

      {/* Tiêu đề: Màu sắc nổi bật, phông chữ đậm */}
      <h1 className="text-6xl font-extrabold text-teal-400 tracking-wider mb-6">
        FOODFAST DELIVERY
      </h1>
      
      {/* Thẻ đếm: Nền khác biệt, bo góc, bóng đổ */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl space-y-6 text-center border border-teal-500"> 
        
        <p className="text-lg font-medium text-gray-200">
          Tailwind CSS Đã Hoạt động!
        </p>

        {/* Nút bấm: Màu nóng, hover effect, bo góc */}
        <button 
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-md" 
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Thay đổi code và xem kết quả HMR.
        </p>
      </div>
      
      {/* Đoạn text cuối */}
      <p className="text-sm mt-8 text-yellow-500 italic">
        Kiểm tra màu nền, phông chữ, và nút bấm!
      </p>
    </div>
  );
}

export default App;