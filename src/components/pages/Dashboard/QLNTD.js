import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function EmployerManagement() {
  const [employer, setEmployer] = useState({
    ten: "",
    email: "",
    sdt: "",
    diachi: "",
    MaND: "",
    logo: "",
    Soluongdangbai: 0,
  });
  const [employers, setEmployers] = useState([]);
  const [availableMaNDs, setAvailableMaNDs] = useState([]); // New state for available MaNDs

  // Export employer data to PDF
  const exportToPDF = () => {
    // Khởi tạo tài liệu PDF
    const doc = new jsPDF();

    // Cài đặt font và tiêu đề
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Danh Sách Nhà Tuyển Dụng", 14, 20); // Tiêu đề PDF
    doc.setFontSize(12);

    // Cấu trúc tiêu đề và dữ liệu cho bảng
    const headers = [
      [
        "Tên",
        "Email",
        "Số điện thoại",
        "Địa chỉ",
        "User ID",
        "Logo",
        "Số lượng bài đăng",
      ],
    ];
    const rows = employers.map((emp) => [
      emp.ten || "N/A", // Tên nhà tuyển dụng
      emp.email || "N/A", // Email
      emp.sdt || "N/A", // Số điện thoại
      emp.diachi || "N/A", // Địa chỉ
      emp.MaND || "N/A", // User ID
      emp.logo ? "Có" : "Không", // Hiển thị trạng thái logo
      emp.Soluongdangbai || 0, // Số lượng bài đăng
    ]);

    // Thêm bảng vào PDF
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

    // Lưu file PDF
    doc.save("danh_sach_nha_tuyen_dung.pdf");
  };

  // Fetch existing employers from the backend
  const fetchEmployers = async () => {
    try {
      const response = await axios.get("/nhatd");
      setEmployers(response.data);
    } catch (error) {
      console.error("Error fetching employers:", error);
    }
  };

  // Fetch available MaNDs from the backend
  const fetchMaNDs = async () => {
    try {
      const response = await axios.get("/nguoidung");
      setAvailableMaNDs(response.data);
    } catch (error) {
      console.error("Error fetching MaND options:", error);
    }
  };

  useEffect(() => {
    fetchEmployers();
    fetchMaNDs();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployer((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/nhatd", employer);
      setEmployers((prev) => [...prev, response.data]);
      setEmployer({
        ten: "",
        email: "",
        sdt: "",
        diachi: "",
        MaND: "",
        logo: "",
        Soluongdangbai: 0,
      });
    } catch (error) {
      console.error("Error adding employer:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý nhà tuyển dụng
      </h1>

      <div className="text-right mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">
              Tên nhà tuyển dụng
            </label>
            <input
              type="text"
              name="ten"
              value={employer.ten}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập tên"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={employer.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input
              type="text"
              name="sdt"
              value={employer.sdt}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Địa chỉ</label>
            <input
              type="text"
              name="diachi"
              value={employer.diachi}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập địa chỉ"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mã người dùng</label>
            <select
              name="MaND"
              value={employer.MaND}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn mã người dùng</option>
              {availableMaNDs.map((user) => (
                <option key={user.MaND} value={user.MaND}>
                  {user.MaND} - {user.ten}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Logo</label>
            <input
              type="text"
              name="logo"
              value={employer.logo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Link logo"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Số lượng đăng bài
            </label>
            <input
              type="number"
              name="Soluongdangbai"
              value={employer.Soluongdangbai}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Số lượng đăng bài"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
      </form>

      {/* Employer Table */}
      <table className="min-w-full bg-white border rounded-lg mt-6 shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">SĐT</th>
            <th className="px-4 py-2">Địa chỉ</th>
            <th className="px-4 py-2">Mã ND</th>
            <th className="px-4 py-2">Logo</th>
            <th className="px-4 py-2">Số lượng đăng bài</th>
          </tr>
        </thead>
        <tbody>
          {employers.map((emp) => (
            <tr key={emp.MaNTD} className="border-b">
              <td className="px-4 py-2">{emp.ten}</td>
              <td className="px-4 py-2">{emp.email}</td>
              <td className="px-4 py-2">{emp.sdt}</td>
              <td className="px-4 py-2">{emp.diachi}</td>
              <td className="px-4 py-2">{emp.MaND}</td>
              <td className="px-4 py-2">{emp.logo}</td>
              <td className="px-4 py-2">{emp.Soluongdangbai}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployerManagement;
