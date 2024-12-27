import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../slice/Roboto-Regular-normal.js";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import {
  Loader2,
  Eye,
  Check,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
function App() {
  const [jobPosts, setJobPosts] = useState([]); // Danh sách bài đăng
  const [recruiters, setRecruiters] = useState([]); // Danh sách nhà tuyển dụng
  const [filteredJobPosts, setFilteredJobPosts] = useState([]); // Danh sách đã lọc
  const [statusFilter, setStatusFilter] = useState("all"); // Bộ lọc trạng thái
  const [selectedPost, setSelectedPost] = useState(null); // Bài đăng được chọn
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [users, setUsers] = useState([]);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Calculate pagination values
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredJobPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // Handle page changes
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Lọc theo trạng thái
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
    if (status === "all") {
      setFilteredJobPosts(jobPosts);
    } else {
      setFilteredJobPosts(jobPosts.filter((post) => post.trangthai === status));
    }
  };

  // Update total pages when filtered posts change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredJobPosts.length / postsPerPage));
  }, [filteredJobPosts, postsPerPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/nguoidung");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch danh sách bài đăng
  const fetchJobPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/tintd/admin");
      console.log("🚀 ~ fetchJobPosts ~ response:", response);
      setJobPosts(response.data);
      setFilteredJobPosts(
        response.data.filter(
          (post) => statusFilter === "all" || post.trangthai === statusFilter
        )
      ); // Áp dụng bộ lọc
    } catch (error) {
      toast.error("Lỗi tải danh sách bài đăng");
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách nhà tuyển dụng
  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("/nhatd");
      setRecruiters(response.data);
    } catch (error) {
      toast.error("Lỗi tải danh sách nhà tuyển dụng");
    }
  };

  // Xử lý duyệt bài đăng
  const handleSubmit = async (id) => {
    const post = jobPosts.find((post) => post.id === id);

    try {
      await axios.post("/tintd/duyet", post);
      toast.success("Duyệt thành công");
      fetchJobPosts(); // Tải lại danh sách
    } catch (error) {
      toast.error(`Lỗi duyệt: ${error.message}`);
    }
  };

  const XoaTinTD = async (id) => {
    try {
      await axios.delete("/tintd", {
        params: {
          id: id,
        },
      });
      toast.success("Xóa thành công");
      fetchJobPosts(); // Tải lại danh sách
    } catch (error) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };

  // Xem chi tiết bài đăng
  const xemChiTiet = (id) => {
    const post = jobPosts.find((post) => {
      return post.id === id;
    });
    console.log("🚀 ~ xemChiTiet ~ post:", post.noibat);
    setSelectedPost(post);
  };

  // Export danh sách ra PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Tin tuyển dụng", 14, 20);
    doc.setFontSize(12);

    const headers = [
      [
        "Tiêu đề",
        "Mô tả",
        "Mức lương",
        "Ngày hết hạn",
        "Trạng thái",
        "Nhà tuyển dụng",
      ],
    ];
    const rows = jobPosts.map((post) => [
      post.tieude,
      post.mota,
      post.mucluong,
      new Date(post.Ngayhethan).toLocaleDateString(),
      post.trangthai,
      recruiters.find((rec) => rec.id === post.MaNTD)?.ten || "N/A",
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

    doc.save("job_posts_list.pdf");
  };
  const closeModal = () => {
    setSelectedPost(null);
  };
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  const onClose = () => {
    setRejectModalOpen(false); // Close the modal
    setRejectReason(""); // Reset the reason field
  };
  const openRejectModal = (postId) => {
    setSelectedPostId(postId);
    setRejectModalOpen(true);
  };
  const handleSubmittc = async () => {
    if (!selectedPostId) {
      toast.error("Vui lòng chọn bài đăng để từ chối.");
      return;
    }

    const post = jobPosts.find((post) => post.id === selectedPostId);
    console.log("🚀 ~ handleSubmittc ~ post:", post);

    if (!post) {
      toast.error("Không tìm thấy bài đăng.");
      return;
    }

    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối.");
      return;
    }

    try {
      // Send both the post ID and the rejection reason
      await axios.post("/tintd/tuchoi", {
        post: post,
        reason: rejectReason,
      });

      toast.success("Từ chối thành công!");
      fetchJobPosts(); // Reload the job posts list
      setRejectModalOpen(false); // Close the modal after submission
      setRejectReason(""); // Reset the reason field
    } catch (error) {
      toast.error(
        `Lỗi từ chối: ${error.response?.data?.message || error.message}`
      );
    }
  };
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="flex items-center justify-center mt-4 gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`px-3 py-1 rounded-md border hover:bg-gray-100
                ${currentPage === 1 ? "bg-blue-500 text-white" : ""}`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded-md border hover:bg-gray-100
              ${currentPage === number ? "bg-blue-500 text-white" : ""}`}
          >
            {number}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-3 py-1 rounded-md border hover:bg-gray-100
                ${currentPage === totalPages ? "bg-blue-500 text-white" : ""}`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    );
  };

  useEffect(() => {
    fetchRecruiters();
    fetchJobPosts();
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý tin tuyển dụng
      </h1>
      {/* Existing filters and export button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
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
            <option value="Đã từ chối">Đã từ chối</option>
            <option value="Đã hết hạn">Đã hết hạn</option>
          </select>
        </div>
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      {/* Table with paginated data */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <>
            <table className="min-w-full bg-white border rounded-lg shadow-md">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-4 py-2 w-1/5 text-left">Người đăng</th>
                  <th className="px-4 py-2 w-1/5 text-left">Tiêu đề</th>
                  <th className="px-4 py-2 w-1/5 text-left">Nhà tuyển dụng</th>
                  <th className="px-4 py-2 w-1/10 text-center">Trạng thái</th>
                  <th className="px-4 py-2 w-1/10 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post) => (
                  <tr key={post.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 w-1/5">
                      {users.find((rec) => rec.id === post.employer.MaND)
                        ?.username || "N/A"}
                    </td>
                    <td className="px-4 py-2 w-1/5">{post.tieude}</td>
                    <td className="px-4 py-2 w-1/5">
                      {recruiters.find((rec) => rec.id === post.MaNTD)?.ten ||
                        "N/A"}
                    </td>
                    <td className="px-4 py-2 w-1/10 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          post.trangthai === "Đã duyệt"
                            ? "bg-green-100 text-green-800"
                            : post.trangthai === "Chờ duyệt"
                            ? "bg-yellow-100 text-yellow-800"
                            : post.trangthai === "Đã từ chối"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.trangthai}
                      </span>
                    </td>
                    <td className="px-4 py-3 w-1/10">
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          onClick={() => xemChiTiet(post.id)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          onClick={() => handleSubmit(post.id)}
                          title="Duyệt tin"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded"
                          onClick={() => openRejectModal(post.id)}
                          title="Từ chối"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Bạn có chắc chắn muốn xóa tin tuyển dụng này?"
                              )
                            ) {
                              XoaTinTD(post.id);
                            }
                          }}
                          title="Xóa tin"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination component */}
            <Pagination />

            {/* Posts per page info */}
            <div className="text-center text-sm text-gray-600 mt-2">
              Hiển thị {indexOfFirstPost + 1} -{" "}
              {Math.min(indexOfLastPost, filteredJobPosts.length)} /{" "}
              {filteredJobPosts.length} tin tuyển dụng
            </div>
          </>
        )}
      </div>
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">
              Từ chối tin tuyển dụng
            </h3>
            <textarea
              className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 rounded"
                onClick={handleSubmittc}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedPost && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3 max-h-[90vh] flex flex-col">
            <div className="overflow-y-auto flex-1">
              <p>{selectedPost.noibat ? "true" : "false"}</p>
              <h2 className="text-xl font-bold mb-4">{selectedPost.tieude}</h2>
              <p className="mb-4">
                <strong>Nhà tuyển dụng:</strong>{" "}
                {recruiters.find((rec) => rec.id === selectedPost.MaNTD)?.ten ||
                  "N/A"}
              </p>
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  {selectedPost?.title || "Thông tin tuyển dụng"}
                </h1>
                <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                  <div>
                    <strong>Kinh nghiệm</strong>{" "}
                    {selectedPost?.kinhNghiem || "N/A"}
                  </div>
                  <div>
                    <strong>Cấp bậc : </strong>
                    {selectedPost?.levels?.length > 0
                      ? selectedPost.levels.map((level, index) => (
                          <span key={index}>
                            {level.ten || "N/A"}
                            {index < selectedPost.levels.length - 1 &&
                              ", "}{" "}
                          </span>
                        ))
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Loại hợp đồng : </strong>{" "}
                    {selectedPost?.loaiHopdong || "N/A"}
                  </div>
                  <div>
                    <strong>Kỹ năng : </strong>
                    {selectedPost?.skills?.length > 0
                      ? selectedPost.skills.map((skill, index) => (
                          <span key={index}>
                            {skill.ten || "N/A"}
                            {index < selectedPost.skills.length - 1 &&
                              ", "}{" "}
                          </span>
                        ))
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedPost?.diaChiLamviec || "N/A"}
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Mô tả công việc
                  </h2>
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: selectedPost.mota || "Thông tin không có sẵn.",
                    }}
                  ></p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={closeModal}
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

export default App;
