import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // Lấy đường dẫn hiện tại
  const { pathname } = useLocation();

  useEffect(() => {
    // Mỗi khi pathname thay đổi, cuộn màn hình lên toạ độ (0, 0)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}