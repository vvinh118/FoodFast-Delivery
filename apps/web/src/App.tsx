// apps/web/src/App.tsx
import Header from "./components/Header";
import Button from "./components/Button";


export default function App() {
  return (
    <>
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold text-blue-400">Trang chính</h1>
        <p className="mt-2 text-gray-300">FoodFast Delivery Web</p>
      </main>
      <footer className="py-3 text-sm text-gray-500">© 2025 Thư-Vinh Team</footer>
    </div>
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Demo Button</h1>
      <Button />
    </div>
    </>
  );
}