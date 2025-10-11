interface CartItem {
  name: string;
  price: number;
  image: string;
}

interface CartProps {
  items: CartItem[];
}

export default function Cart({ items }: CartProps) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        🛒 Giỏ hàng
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">Chưa có sản phẩm nào</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-10 h-10 object-cover rounded-md"
              />
              <span className="flex-1 text-sm text-gray-700">{item.name}</span>
              <span className="text-gray-800 font-medium">${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
