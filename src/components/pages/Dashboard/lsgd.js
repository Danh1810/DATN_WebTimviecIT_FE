import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function PaymentHistory() {
  const [paymentHistory, setPaymentHistory] = useState([]); // List of payment history records
  const [employers, setEmployers] = useState([]); // List of employers for dropdown
  const [payments, setPayments] = useState([]); // List of payment options for dropdown
  const [newPayment, setNewPayment] = useState({
    MaNTT: "",
    trangthai: "",
    sotien: "",
    goimua: "",
    Ngaythanhtoan: "",
    Soluongmua: 1,
  });

  // Export payment history to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Set title and metadata
    doc.setFontSize(18);
    doc.text("Lịch sử thanh toán ", 14, 20);
    doc.setFontSize(12);

    // Prepare headers and data for table
    const headers = [["Employer", "", "Status", "Amount", "Date", "Quantity"]];
    const rows = paymentHistory.map((record) => [
      record.trangthai,
      record.sotien,
      new Date(record.Ngaythanhtoan).toLocaleDateString(),
      record.Soluongmua,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: "striped",
      styles: {
        font: "Roboto-Regular",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Màu nền tiêu đề bảng
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
    });

    // Save the PDF
    doc.save("payment_history.pdf");
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("/lstt");
      console.log("🚀 ~ fetchPaymentHistory ~ response:", response.data);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  // Handle form field changes

  // Add a new payment history record

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Lịch sử Thanh Toán
      </h1>
      {/* Table to display payment history */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
            >
              Người thanh toán
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Gói mua
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Trạng Thái
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Số Tiền
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ngày Thanh Toán
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Số Lượng Mua
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paymentHistory.map((record) => (
            <tr
              key={record.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.users.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.goimua}
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
                  {record.trangthai}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(record.sotien)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(record.Ngaythanhtoan).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {record.Soluongmua}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to export table data to PDF */}
      <button
        onClick={exportToPDF}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Export to PDF
      </button>
    </div>
  );
}

export default PaymentHistory;
