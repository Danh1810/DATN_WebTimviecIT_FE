import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function PaymentHistory() {
  const id = localStorage.getItem("id");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filterType, setFilterType] = useState("all"); // 'all', 'month', 'quarter', 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor((new Date().getMonth() + 3) / 3)
  );

  const [newPayment, setNewPayment] = useState({
    MaNTT: "",
    trangthai: "",
    sotien: "",
    goimua: "",
    Ngaythanhtoan: "",
    Soluongmua: 1,
  });

  // Generate arrays for select options
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const quarters = [1, 2, 3, 4];

  // Filter payment history based on selected date range
  const getFilteredPayments = () => {
    return paymentHistory.filter((payment) => {
      const paymentDate = new Date(payment.Ngaythanhtoan);
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth() + 1;
      const paymentQuarter = Math.floor((paymentDate.getMonth() + 3) / 3);

      switch (filterType) {
        case "month":
          return paymentYear === selectedYear && paymentMonth === selectedMonth;
        case "quarter":
          return (
            paymentYear === selectedYear && paymentQuarter === selectedQuarter
          );
        case "year":
          return paymentYear === selectedYear;
        default:
          return true;
      }
    });
  };

  // Export payment history to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");

    // Set title and metadata
    doc.setFontSize(18);
    doc.text("Hóa đơn thanh toán", 14, 20);

    // Add filter information
    doc.setFontSize(12);
    let filterInfo = "Thời gian: ";
    switch (filterType) {
      case "month":
        filterInfo += `Tháng ${selectedMonth}/${selectedYear}`;
        break;
      case "quarter":
        filterInfo += `Quý ${selectedQuarter}/${selectedYear}`;
        break;
      case "year":
        filterInfo += `Năm ${selectedYear}`;
        break;
      default:
        filterInfo += "Tất cả";
    }
    doc.text(filterInfo, 14, 30);

    // Prepare headers and data for table
    const headers = [
      ["Gói mua", "Trạng Thái", "Số Tiền", "Ngày Thanh Toán", "Số Lượng Mua"],
    ];
    const filteredData = getFilteredPayments();
    const rows = filteredData.map((record) => [
      record.goimua,
      record.trangthai,
      record.sotien,
      new Date(record.Ngaythanhtoan).toLocaleDateString(),
      record.Soluongmua,
    ]);

    // Add table to PDF
    doc.autoTable({
      head: headers,
      body: rows,
      startY: 40,
      theme: "striped",
      styles: {
        font: "Roboto-Regular",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
    });

    // Save the PDF
    const fileName = `payment_history_${filterType}_${selectedYear}${
      filterType === "month"
        ? "_" + selectedMonth
        : filterType === "quarter"
        ? "_Q" + selectedQuarter
        : ""
    }.pdf`;
    doc.save(fileName);
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("/lstt/ntd", { params: { id: id } });
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Lịch sử Thanh Toán
      </h1>

      {/* Filter controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="mr-2">Lọc theo:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">Tất cả</option>
              <option value="month">Tháng</option>
              <option value="quarter">Quý</option>
              <option value="year">Năm</option>
            </select>
          </div>

          {filterType !== "all" && (
            <div>
              <label className="mr-2">Năm:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === "month" && (
            <div>
              <label className="mr-2">Tháng:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === "quarter" && (
            <div>
              <label className="mr-2">Quý:</label>
              <select
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                className="border rounded px-2 py-1"
              >
                {quarters.map((quarter) => (
                  <option key={quarter} value={quarter}>
                    {quarter}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

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
          {getFilteredPayments().map((record) => (
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

      {/* Export button */}
      <button
        onClick={exportToPDF}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition-colors"
      >
        Export to PDF
      </button>
    </div>
  );
}

export default PaymentHistory;
