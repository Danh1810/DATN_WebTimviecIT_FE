import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../services/axios";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get("/lstt/detail", {
          params: { id: id },
        });
        console.log("🚀 ~ fetchTransaction ~ response:", response);
        setTransaction(response.data);
      } catch (error) {
        console.error("There was an error fetching the transaction!", error);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleButtonClick = () => {
    if (transaction?.users?.MaQuyen === 2) {
      navigate("/ntd/muabaidang");
    } else {
      navigate("/tt");
    }
  };

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-500 text-white p-6 text-center">
            <h1 className="text-2xl font-bold">Chi tiết giao dịch</h1>
          </div>

          {/* Package Info */}
          <div className="bg-blue-50 p-6 border-b border-blue-100">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                Thông tin gói
              </h2>
              <div className="inline-block bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {transaction.goimua || "Gói tin tuyển dụng"}
                </div>
                <div className="text-gray-600">
                  {transaction.Soluongmua} tin đăng
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Người thanh toán */}
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">
                Người thanh toán
              </label>
              <div className="text-gray-900">
                {transaction.users ? transaction.users.username : "N/A"}
              </div>
            </div>

            {/* Loại thanh toán */}
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">
                Loại thanh toán
              </label>
              <div className="text-gray-900">{transaction.loaiThanhtoan}</div>
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">
                Trạng thái
              </label>
              <div className="flex items-center">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    transaction.trangthai === "Thành công"
                      ? "bg-green-500"
                      : "bg-gray-400"
                  } mr-2`}
                ></div>
                <span
                  className={
                    transaction.trangthai === "Thành công"
                      ? "text-green-600"
                      : "text-gray-900"
                  }
                >
                  {transaction.trangthai}
                </span>
              </div>
            </div>

            {/* Số tiền */}
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">
                Số tiền
              </label>
              <div className="text-gray-900 font-semibold text-lg">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(transaction.sotien)}
              </div>
            </div>

            {/* Ngày thanh toán */}
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">
                Ngày thanh toán
              </label>
              <div className="text-gray-900">
                {new Date(transaction.Ngaythanhtoan).toLocaleDateString(
                  "vi-VN",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </div>
            </div>

            {/* Số lượng mua */}
            <div className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 pb-4">
              <label className="text-sm font-medium text-gray-600 mb-1 sm:mb-0">
                Số lượng tin đăng
              </label>
              <div className="text-gray-900">{transaction.Soluongmua} tin</div>
            </div>

            {/* Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleButtonClick}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-colors duration-200 focus:outline-none focus:ring-2 
                         focus:ring-blue-300 focus:ring-offset-2 shadow-md"
              >
                Trở lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
