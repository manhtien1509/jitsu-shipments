import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  let message = "Đã có lỗi xảy ra";
  let status = "Oops!";

  if (isRouteErrorResponse(error)) {
    status = String(error.status);
    message = error.statusText || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-red-600">{status}</h1>
      <h2 className="text-2xl font-semibold">Có lỗi xảy ra</h2>
      <p className="max-w-md text-gray-500">{message}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Tải lại trang
        </button>
        <Link
          to="/"
          className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};
