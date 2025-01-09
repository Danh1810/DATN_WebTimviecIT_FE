import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

const Luuhoso = () => {
  const id = localStorage.getItem("id");
  const [resumes, setResumes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchResumes = async () => {
    try {
      const response = await axios.get("/luuhs/ntd", { params: { id: id } });
      setResumes(response.data);
    } catch (error) {
      console.error("Error fetching resume data:", error);
      toast.error("Không thể tải dữ liệu hồ sơ");
    }
  };

  const deleteResume = async (id) => {
    try {
      await axios.delete("/luuhs", { params: { id: id } });
      toast.success("Xóa thành công");
      fetchResumes();
    } catch (error) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Filter functions
  const filterResumes = () => {
    let filtered = [...resumes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.HS_LHS?.tenhoso.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.HS_LHS?.trangthai === statusFilter
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.HS_LHS?.ngayCapNhat);
        switch (dateFilter) {
          case "today":
            return itemDate >= today;
          case "week":
            const lastWeek = new Date(now.setDate(now.getDate() - 7));
            return itemDate >= lastWeek;
          case "month":
            const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
            return itemDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const filteredData = filterResumes();
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-8xl">
        <div className="p-4 sm:p-6">
          <div className="mb-4 space-y-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hồ sơ..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2 border rounded-md min-w-[160px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Đang hoạt động">Đang hoạt động</option>
                <option value="Không hoạt động">Không hoạt động</option>
              </select>

              <select
                className="px-4 py-2 border rounded-md min-w-[160px]"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">Tất cả thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              Tìm thấy {totalItems} hồ sơ phù hợp
            </div>
          </div>

          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                  Tên Hồ Sơ
                </th>
                <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                  Cấp Bậc
                </th>
                <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                  Ngày Cập Nhật
                </th>
                <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                  Trạng Thái
                </th>
                <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 border-b text-gray-800">
                      {item.HS_LHS?.tenhoso || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-gray-800">
                      {item.HS_LHS?.capBacHienTai || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b text-gray-800">
                      {item.HS_LHS?.ngayCapNhat
                        ? new Date(item.HS_LHS.ngayCapNhat).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.HS_LHS?.trangthai === "Đang hoạt động"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.HS_LHS?.trangthai || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b space-x-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                        onClick={() =>
                          window.open(item.HS_LHS?.fileHoso, "_blank")
                        }
                      >
                        Xem hồ sơ
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                        onClick={() => deleteResume(item.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-gray-500 text-center border-b"
                  >
                    Chưa có hồ sơ ứng tuyển nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalItems > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Hiển thị {Math.min(itemsPerPage, totalItems)} / {totalItems} hồ
                sơ
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Tiếp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Luuhoso;
