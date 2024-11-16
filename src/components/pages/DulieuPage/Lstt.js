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
    MaTT: "",
    trangthai: "pending",
    sotien: "",
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
      employers.find((emp) => emp.id === record.MaNTT)?.ten || "N/A",
      payments.find((pay) => pay.id === record.MaTT)?.ten ||
        `Payment #${record.MaTT}`,
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
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  // Fetch employers for dropdown
  const fetchEmployers = async () => {
    try {
      const response = await axios.get("/nhatd");
      setEmployers(response.data);
    } catch (error) {
      console.error("Error fetching employers:", error);
    }
  };

  // Fetch payment options for dropdown
  const fetchPayments = async () => {
    try {
      const response = await axios.get("/thanhtoan");
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching payment options:", error);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
    fetchEmployers();
    fetchPayments();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new payment history record
  const handleAddPayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/lstt", newPayment);
      setPaymentHistory((prev) => [...prev, response.data]);
      setNewPayment({
        MaNTT: "",
        MaTT: "",
        trangthai: "pending",
        sotien: "",
        Ngaythanhtoan: "",
        Soluongmua: 1,
      });
    } catch (error) {
      console.error("Error adding payment record:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Lịch sử Thanh Toán
      </h1>

      {/* Form to add a new payment history record */}
      <form
        onSubmit={handleAddPayment}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Nhà Tuyển Dụng</label>
            <select
              name="MaNTT"
              value={newPayment.MaNTT}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Chọn Nhà Tuyển Dụng --</option>
              {employers.map((employer) => (
                <option key={employer.id} value={employer.id}>
                  {employer.ten}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Thanh Toán</label>
            <select
              name="MaTT"
              value={newPayment.MaTT}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">-- Chọn Thanh Toán --</option>
              {payments.map((payment) => (
                <option key={payment.id} value={payment.id}>
                  {payment.ten || `Payment #${payment.id}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Trạng Thái</label>
            <select
              name="trangthai"
              value={newPayment.trangthai}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Số Tiền</label>
            <input
              type="number"
              name="sotien"
              value={newPayment.sotien}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập số tiền"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Ngày Thanh Toán</label>
            <input
              type="date"
              name="Ngaythanhtoan"
              value={newPayment.Ngaythanhtoan}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Số Lượng Mua</label>
            <input
              type="number"
              name="Soluongmua"
              value={newPayment.Soluongmua}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập số lượng"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm Lịch Sử Thanh Toán
        </button>
      </form>

      {/* Table to display payment history */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Nhà Tuyển Dụng</th>
            <th className="px-4 py-2">Thanh Toán</th>
            <th className="px-4 py-2">Trạng Thái</th>
            <th className="px-4 py-2">Số Tiền</th>
            <th className="px-4 py-2">Ngày Thanh Toán</th>
            <th className="px-4 py-2">Số Lượng Mua</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map((record) => (
            <tr key={`${record.MaNTT}-${record.MaTT}`} className="border-b">
              <td className="px-4 py-2">
                {employers.find((emp) => emp.id === record.MaNTT)?.ten || "N/A"}
              </td>
              <td className="px-4 py-2">
                {payments.find((pay) => pay.id === record.MaTT)?.description ||
                  `Payment #${record.MaTT}`}
              </td>
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
