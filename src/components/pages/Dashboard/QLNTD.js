import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
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
  const [filteredJobPosts, setFilteredJobPosts] = useState([]); // Danh sách đã lọc
  const [statusFilter, setStatusFilter] = useState("all");
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
      console.log("🚀 ~ fetchEmployers ~ response:", response.data);
      setEmployers(response.data);
      setFilteredJobPosts(
        response.data.filter(
          (post) => statusFilter === "all" || post.trangthai === statusFilter
        )
      ); // Áp dụng bộ lọc
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
  const [ntd, setntd] = useState(null);
  const xemChiTiet = (id) => {
    const post = employers.find((post) => post.id === id);
    console.log("🚀 ~ xemChiTiet ~  post:", post);
    setntd(post); // Lưu bài đăng được chọn vào state
  };
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "all") {
      setFilteredJobPosts(employers);
    } else {
      setFilteredJobPosts(
        employers.filter((post) => post.trangthai === status)
      );
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
  const handleSubmitduyet = async (id) => {
    const post = employers.find((post) => post.id === id);

    try {
      setntd(null);
      await axios.post("/nhatd/duyet", post);
      toast.success("Duyệt thành công");
      fetchEmployers(); // Tải lại danh sách
    } catch (error) {
      toast.error(`Lỗi duyệt: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý nhà tuyển dụng
      </h1>
      <div className="flex items-center mb-4">
        <label htmlFor="filterStatus" className="mr-2 font-semibold">
          Lọc theo trạng thái:
        </label>
        <select
          id="filterStatus"
          className="border rounded px-4 py-2"
          onChange={(e) => handleStatusFilterChange(e.target.value)}
        >
          <option value="all">Tất cả</option>
          <option value="Đã duyệt">Đã duyệt</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
          <option value="rejected">Đã từ chối</option>
        </select>
      </div>

      <div className="text-right mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      {/* Employer Table */}
      <table className="min-w-full bg-white border rounded-lg mt-6 shadow-md">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="px-4 py-3 text-left">Tên</th>
            <th className="px-4 py-3 text-left">Địa chỉ</th>
            <th className="px-4 py-3 text-left">Trạng thái</th>
            <th className="px-4 py-3 text-center w-1/4">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredJobPosts.map((emp) => (
            <tr key={emp.id} className="border-b">
              <td className="px-4 py-3">{emp.ten}</td>
              <td className="px-4 py-3">{emp.diachi}</td>
              <td className="px-4 py-3">{emp.trangthai}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    onClick={() => xemChiTiet(emp.id)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    // onClick={() => Chinhsua(emp.MaNTD)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    // onClick={() => XoaNguoiDung(emp.MaNTD)}
                  >
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {ntd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-6 flex flex-col items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden border mb-4">
                  <img
                    src={
                      ntd.logo ||
                      "https://res.cloudinary.com/dlxczbtva/image/upload/v1704720124/oneweedshop/vcgfoxlfcoipwxywcimv.jpg"
                    }
                    alt="Avatar"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Tên nhà tuyển dụng", value: ntd.ten },
                  { label: "Email", value: ntd.email },
                  { label: "Số điện thoại", value: ntd.sdt },
                  { label: "Địa chỉ", value: ntd.diachi },
                  { label: "Website", value: ntd.website },
                  { label: "Lĩnh vực", value: ntd.linhvuc },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <label className="block font-semibold mb-1">{label}</label>
                    <p className="w-full p-2 border rounded bg-gray-100">
                      {value || "Chưa nhập"}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSubmitduyet(ntd.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Duyệt
              </button>
              <button
                onClick={() => setntd(null)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerManagement;
