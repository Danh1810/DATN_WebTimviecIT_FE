import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../slice/Roboto-Regular-normal.js";
import { toast } from "react-toastify";

function App() {
  const [jobPost, setJobPost] = useState({
    tieude: "",
    mota: "",
    mucluong: "",
    Ngayhethan: "",
    trangthai: "",
    MaNTD: "",
  });

  const [jobPosts, setJobPosts] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    // doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    // doc.setFont("Roboto");
    doc.setFont("Roboto-Regular");

    doc.setFontSize(18);
    doc.text("Tin tuyển dụng", 14, 20);
    doc.setFontSize(12);

    const headers = [
      [
        "Tiêu đề",
        "Mô tả ",
        "Mức lương",
        "Ngyaf hết hạn",
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

    doc.save("job_posts_list.pdf");
  };

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd/cd");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("/nhatd");
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (id) => {
    console.log("🚀 ~ handleSubmit ~ id:", id);
    const post = jobPosts.find((post) => post.id === id);
    try {
      const response = await axios.post("/tintd/duyet", post);
      toast.success("Duyệt thành công");
      fetchJobPosts();
    } catch (error) {
      console.error("Lỗi duyệt :", error);
    }
  };
  const [selectedPost, setSelectedPost] = useState(null);

  const xemChiTiet = (id) => {
    const post = jobPosts.find((post) => post.id === id);
    setSelectedPost(post); // Lưu bài đăng được chọn vào state
  };

  const closeModal = () => {
    setSelectedPost(null); // Đóng modal
  };
  useEffect(() => {
    fetchJobPosts();
    fetchRecruiters();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý tin tuyển dụng
      </h1>

      <div className="text-right mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      <>
        {/* Bảng danh sách */}
        <table className="min-w-full bg-white border rounded-lg mt-6 shadow-md">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2">Tiêu đề</th>
              <th className="px-4 py-2">Mô tả</th>
              <th className="px-4 py-2">Nhà tuyển dụng</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobPosts.map((post) => (
              <tr key={post.id} className="border-b">
                <td className="px-4 py-2">{post.tieude}</td>
                <td className="px-4 py-2">{post.mota}</td>
                <td className="px-4 py-2">
                  {recruiters.find((rec) => rec.id === post.MaNTD)?.ten ||
                    "N/A"}
                </td>
                <td className="px-4 py-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    onClick={() => xemChiTiet(post.id)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => console.log("Từ chối:", post.id)}
                  >
                    Từ chối
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleSubmit(post.id)}
                  >
                    Duyệt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
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
                            {/* Thêm dấu phẩy nếu không phải phần tử cuối */}
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
                            {/* Thêm dấu phẩy nếu không phải phần tử cuối */}
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
                  <p className="text-gray-700">
                    {selectedPost?.mota || "Thông tin không có sẵn."}
                  </p>
                </div>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default App;
