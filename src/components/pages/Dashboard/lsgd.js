import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Search, Filter } from "lucide-react";

function PaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [error, setError] = useState(null);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Lịch sử thanh toán", 14, 20);
    doc.setFontSize(12);

    const headers = [
      [
        "Người thanh toán",
        "Gói mua",
        "Trạng thái",
        "Số tiền",
        "Ngày thanh toán",
        "Số lượng",
      ],
    ];
    const rows = filteredData.map((record) => [
      record.users?.username ?? "N/A",
      record.goimua ?? "Không có",
      record.trangthai ?? "N/A",
      new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(parseFloat(record.sotien) ?? 0),
      record.Ngaythanhtoan
        ? new Date(record.Ngaythanhtoan).toLocaleDateString("vi-VN")
        : "N/A",
      record.Soluongmua ?? 0,
    ]);

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: "striped",
      styles: { font: "Roboto-Regular", fontSize: 10, cellPadding: 3 },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
    });

    doc.save("payment_history.pdf");
  };

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("/lstt");
      setPaymentHistory(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const filteredData = paymentHistory.filter((record) => {
    // Search in username (if user exists) and payment package (if exists)
    const username = record.users?.username?.toLowerCase() ?? "";
    const goimua = record.goimua?.toLowerCase() ?? "không có";
    const searchTermLower = searchTerm.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      username.includes(searchTermLower) ||
      goimua.includes(searchTermLower);

    // Filter by status if a status is selected
    const matchesStatus =
      filterStatus === "" || record.trangthai === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Lịch sử Thanh Toán
      </h1>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc gói mua..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Lọc trạng thái</option>
            <option value="Thành công">Thành công</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Thất bại">Thất bại</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                Người thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gói mua
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng Thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày Thanh Toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số Lượng Mua
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((record) => (
              <tr
                key={record.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.users?.username ?? "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.goimua ?? "Không có"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      record.trangthai === "Thành công"
                        ? "bg-green-100 text-green-800"
                        : record.trangthai === "Đang xử lý"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {record.trangthai ?? "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(parseFloat(record.sotien) ?? 0)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.Ngaythanhtoan
                    ? new Date(record.Ngaythanhtoan).toLocaleDateString("vi-VN")
                    : "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.Soluongmua ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2 items-center">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="text-sm text-gray-600">mục mỗi trang</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Trước
          </button>
          <span className="px-3 py-1">
            Trang {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Sau
          </button>
        </div>

        <button
          onClick={exportToPDF}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
}

export default PaymentHistory;
