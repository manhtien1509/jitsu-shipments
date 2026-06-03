import { Link } from "react-router-dom";

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold">Trang không tồn tại</h2>
      <p className="text-gray-500">
        Đường dẫn bạn truy cập không có hoặc đã bị xóa.
      </p>
      <Link
        to="/"
        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Về trang chủ
      </Link>
    </div>
  );
};
