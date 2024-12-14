import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function PaymentHistory() {
  const id = localStorage.getItem("id");
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
      const response = await axios.get("/lstt/ntd", { params: { id: id } });
      console.log("🚀 ~ fetchPaymentHistory ~ response:", response.data);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [id]);

  // Handle form field changes

  // Add a new payment history record

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Lịch sử Thanh Toán
      </h1>
      {/* Table to display payment history */}
      <table className="min-w-full bg-white border rounded-lg shadow-md border-collapse">
        <colgroup>
          <col className="w-1/5" />
          <col className="w-1/5" />
          <col className="w-1/5" />
          <col className="w-1/5" />
          <col className="w-1/5" />
        </colgroup>
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-4 py-2 text-left">Gói mua</th>
            <th className="px-4 py-2 text-left">Trạng Thái</th>
            <th className="px-4 py-2 text-left">Số Tiền</th>
            <th className="px-4 py-2 text-left">Ngày Thanh Toán</th>
            <th className="px-4 py-2 text-left">Số Lượng Mua</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((record) => (
            <tr key={record.MaNTT} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{record.goimua}</td>
              <td className="px-4 py-2">{record.trangthai}</td>
              <td className="px-4 py-2">{record.sotien}</td>
              <td className="px-4 py-2">
                {new Date(record.Ngaythanhtoan).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{record.Soluongmua}</td>
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
