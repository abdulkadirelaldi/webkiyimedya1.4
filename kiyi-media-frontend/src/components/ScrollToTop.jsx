import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  // Şu an hangi sayfada olduğumuzun bilgisini alıyoruz
  const { pathname } = useLocation();

  useEffect(() => {
    // Sayfa yolu (pathname) her değiştiğinde bu kod çalışır:
    // Pencereyi (window) en tepeye (0, 0) kaydır.
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Bu bileşen ekranda görünmez, sadece arkada çalışır.
}