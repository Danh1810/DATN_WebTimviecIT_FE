import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "react-toastify";
import { Search } from "lucide-react";

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
  const [availableMaNDs, setAvailableMaNDs] = useState([]);
  const [filteredJobPosts, setFilteredJobPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Search and filter function
  const filterAndSearchEmployers = () => {
    let filtered = [...employers];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((emp) => emp.trangthai === statusFilter);
    }

    // Apply search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.ten?.toLowerCase().includes(searchLower) ||
          emp.email?.toLowerCase().includes(searchLower) ||
          emp.diachi?.toLowerCase().includes(searchLower) ||
          emp.sdt?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredJobPosts(filtered);
  };

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredJobPosts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredJobPosts.length / itemsPerPage);

  // Export to PDF function remains the same
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Danh Sách Nhà Tuyển Dụng", 14, 20);
    doc.setFontSize(12);

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
      emp.ten || "N/A",
      emp.email || "N/A",
      emp.sdt || "N/A",
      emp.diachi || "N/A",
      emp.MaND || "N/A",
      emp.logo ? "Có" : "Không",
      emp.Soluongdangbai || 0,
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

    doc.save("danh_sach_nha_tuyen_dung.pdf");
  };

  const fetchEmployers = async () => {
    try {
      const response = await axios.get("/nhatd");
      setEmployers(response.data);
      filterAndSearchEmployers();
    } catch (error) {
      console.error("Error fetching employers:", error);
      toast.error("Không thể tải danh sách nhà tuyển dụng");
    }
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  useEffect(() => {
    filterAndSearchEmployers();
  }, [statusFilter, searchTerm, employers]);

  const [ntd, setntd] = useState(null);

  const xemChiTiet = (id) => {
    const post = employers.find((post) => post.id === id);
    setntd(post);
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete("/nhatd", {
        params: {
          id: id,
        },
      });
      toast.success("Xóa thành công");
      fetchEmployers(); // Tải lại danh sách
    } catch (error) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSubmitduyet = async (id) => {
    const post = employers.find((post) => post.id === id);
    try {
      setntd(null);
      await axios.post("/nhatd/duyet", post);
      toast.success("Duyệt thành công");
      fetchEmployers();
    } catch (error) {
      toast.error(`Lỗi duyệt: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý nhà tuyển dụng
      </h1>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nhà tuyển dụng..."
              className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center">
          <label htmlFor="filterStatus" className="mr-2 font-semibold">
            Lọc theo trạng thái:
          </label>
          <select
            id="filterStatus"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>

        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Export to PDF
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-3 text-left">Tên</th>
              <th className="px-4 py-3 text-left">Địa chỉ</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-center w-1/4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
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
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-1 rounded ${
              currentPage === pageNum
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {pageNum}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Modal Section */}
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
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => handleSubmitduyet(ntd.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  Duyệt
                </button>
                <button
                  onClick={() => setntd(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerManagement;
