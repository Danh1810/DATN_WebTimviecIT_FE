import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../slice/Roboto-Regular-normal";

function PaymentHistory() {
  const id = localStorage.getItem("id");
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filterType, setFilterType] = useState("all"); // 'all', 'month', 'quarter', 'year'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedQuarter, setSelectedQuarter] = useState(
    Math.floor((new Date().getMonth() + 3) / 3)
  );
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
  const getPaginatedData = () => {
    const filteredData = getFilteredPayments();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(getFilteredPayments().length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const getPageNumbers = () => {
    const totalPagesToShow = 5;
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - Math.floor(totalPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + totalPagesToShow - 1);

    if (endPage - startPage + 1 < totalPagesToShow) {
      startPage = Math.max(1, endPage - totalPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Export payment history to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");

    // Get filtered data
    const filteredData = getFilteredPayments();

    // Get the first company's details
    const customerCompany =
      filteredData.length > 0 && filteredData[0].users.ND_NTD.length > 0
        ? filteredData[0].users.ND_NTD[0]
        : null;

    // Company logos URLs
    const companyLogoUrl =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREfsesMJwwXL8130hzXhA8LtGBG1HMN6lKLA&s"; // Replace with your company's logo URL
    const customerLogoUrl = customerCompany ? customerCompany.logo : null;

    // Load both logos
    const companyLogo = new Image();
    const customerLogo = new Image();
    let loadedImages = 0;
    const totalImagesToLoad = customerLogoUrl ? 2 : 1;

    const generatePDF = () => {
      // Add company logo (left side)
      doc.addImage(companyLogo, "PNG", 20, 10, 20, 20);

      // Add company name (left side)
      doc.setFontSize(14);
      doc.setFont("Roboto-Regular", "bold");
      doc.text("VIEC LAM IT", 45, 20);

      // Center the invoice title
      doc.setFontSize(14);
      doc.setFont("Roboto-Regular", "normal");
      const title = "HÓA ĐƠN THANH TOÁN";
      const titleWidth =
        (doc.getStringUnitWidth(title) * 14) / doc.internal.scaleFactor;
      const pageWidth = doc.internal.pageSize.width;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 35);

      // Add company service description
      doc.setFontSize(11);
      doc.setFont("Roboto-Regular", "normal");
      doc.text("Dịch vụ tuyển dụng IT", 20, 45);

      // Customer section
      const companyName = customerCompany ? customerCompany.ten : "";
      const customerAddress = customerCompany ? customerCompany.diachi : "";

      // Add customer logo if available (next to customer info)
      if (customerLogoUrl && customerLogo.complete) {
        doc.addImage(customerLogo, "PNG", 20, 55, 20, 20);
        // Adjust customer info to be next to the logo
        doc.text(`Tên công ty: ${companyName}`, 45, 65);
        doc.text(`Địa chỉ: ${customerAddress}`, 45, 72);
      } else {
        // If no logo, keep customer info at original position
        doc.text(`Tên công ty: ${companyName}`, 20, 65);
        doc.text(`Địa chỉ: ${customerAddress}`, 20, 72);
      }

      // Create table headers
      const headers = [
        ["STT", "GÓI DỊCH VỤ", "SỐ LƯỢNG", "ĐƠN GIÁ", "THÀNH TIỀN"],
      ];

      // Transform filtered data into table rows
      const rows = filteredData.map((record, index) => {
        const price = parseFloat(record.sotien) / parseInt(record.Soluongmua);
        const total = parseFloat(record.sotien);
        return [
          (index + 1).toString(),
          record.goimua,
          record.Soluongmua.toString(),
          !isNaN(price) ? formatCurrency(price) : "0 ₫",
          !isNaN(total) ? formatCurrency(total) : "0 ₫",
        ];
      });

      // Add main table
      doc.autoTable({
        head: headers,
        body: rows,
        startY: 85, // Adjusted to account for logo and info
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 5,
          font: "Roboto-Regular",
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontSize: 11,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 15, halign: "center" },
          1: { cellWidth: 70 },
          2: { cellWidth: 30, halign: "center" },
          3: { cellWidth: 35, halign: "right" },
          4: { cellWidth: 40, halign: "right" },
        },
      });

      // Calculate total with error handling
      const totalAmount = filteredData.reduce((sum, record) => {
        const amount = parseFloat(record.sotien);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      // Add total amount as bold text
      doc.setFont("Roboto-Regular", "normal");
      doc.setFontSize(11);
      doc.text(
        `TỔNG CỘNG: ${formatCurrency(totalAmount)}`,
        150,
        doc.previousAutoTable.finalY + 10,
        { align: "right" }
      );
      doc.setFont("Roboto-Regular", "normal");

      // Add date
      const currentDate = new Date();
      const dateStr = `TP.HCM, ngày ${currentDate.getDate()} tháng ${
        currentDate.getMonth() + 1
      } năm ${currentDate.getFullYear()}`;
      doc.text(dateStr, 120, doc.previousAutoTable.finalY + 65);

      // Add signature labels
      doc.text("Người thanh toán", 30, doc.previousAutoTable.finalY + 80);
      doc.text("Người xuất hóa đơn", 140, doc.previousAutoTable.finalY + 80);
      doc.setFontSize(8);
      doc.text("(Ký, ghi rõ họ tên)", 30, doc.previousAutoTable.finalY + 85);
      doc.text("(Ký, ghi rõ họ tên)", 140, doc.previousAutoTable.finalY + 85);

      // Save the PDF
      const fileName = `hoa_don_thanh_toan_${filterType}_${selectedYear}${
        filterType === "month"
          ? "_" + selectedMonth
          : filterType === "quarter"
          ? "_Q" + selectedQuarter
          : ""
      }.pdf`;
      doc.save(fileName);
    };

    // Handle image loading
    const handleImageLoad = () => {
      loadedImages++;
      if (loadedImages === totalImagesToLoad) {
        generatePDF();
      }
    };

    // Load company logo
    companyLogo.onload = handleImageLoad;
    companyLogo.onerror = () => {
      console.error("Error loading company logo");
      handleImageLoad(); // Continue even if logo fails to load
    };
    companyLogo.src = companyLogoUrl;

    // Load customer logo if available
    if (customerLogoUrl) {
      customerLogo.onload = handleImageLoad;
      customerLogo.onerror = () => {
        console.error("Error loading customer logo");
        handleImageLoad(); // Continue even if logo fails to load
      };
      customerLogo.src = customerLogoUrl;
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get("/lstt/ntd", { params: { id: id } });
      console.log("🚀 ~ fetchPaymentHistory ~ response.data:", response.data);
      setPaymentHistory(response.data);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    }
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, selectedYear, selectedMonth, selectedQuarter]);

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
          <col className="w-1/6" />
          <col className="w-1/6" />
          <col className="w-1/6" />
          <col className="w-1/6" />
          <col className="w-1/6" />
          <col className="w-1/6" />
        </colgroup>
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-4 py-2 text-left">Gói mua</th>
            <th className="px-4 py-2 text-left">Trạng Thái</th>
            <th className="px-4 py-2 text-left">Số Tiền</th>
            <th className="px-4 py-2 text-left">Ngày Thanh Toán</th>
            <th className="px-4 py-2 text-left">Số Lượng Mua</th>
            <th className="px-4 py-2 text-left">Tổng Tiền</th>
          </tr>
        </thead>
        <tbody>
          {getPaginatedData().map((record) => {
            const totalAmount = parseFloat(record.sotien) || 0;
            return (
              <tr key={record.MaNTT} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{record.goimua}</td>
                <td className="px-4 py-2">{record.trangthai}</td>
                <td className="px-4 py-2">{formatCurrency(record.sotien)}</td>
                <td className="px-4 py-2">
                  {new Date(record.Ngaythanhtoan).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">{record.Soluongmua}</td>
                <td className="px-4 py-2">{formatCurrency(totalAmount)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-gray-50">
            <td className="px-4 py-2" colSpan={5}>
              Tổng tiền
            </td>
            <td className="px-4 py-2">
              {formatCurrency(
                getFilteredPayments().reduce((sum, record) => {
                  const amount = parseFloat(record.sotien) || 0;
                  return sum + amount;
                }, 0)
              )}
            </td>
          </tr>
        </tfoot>
      </table>
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          {"<<"}
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          {"<"}
        </button>

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 rounded border ${
              currentPage === pageNum
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          {">"}
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border disabled:opacity-50"
        >
          {">>"}
        </button>

        <span className="ml-4">
          Trang {currentPage} / {totalPages}
        </span>
      </div>

      {/* Export button */}
      <button
        onClick={exportToPDF}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition-colors"
      >
        Xuất hóa đơn
      </button>
    </div>
  );
}

export default PaymentHistory;
