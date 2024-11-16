import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "../../slice/Roboto-Regular-normal.js";

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
      ["Title", "Description", "Salary", "Expiry Date", "Status", "Recruiter"],
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
      const response = await axios.get("/tintd");
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

  useEffect(() => {
    fetchJobPosts();
    fetchRecruiters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/tintd", jobPost);
      setJobPosts((prev) => [...prev, response.data]);
      setJobPost({
        tieude: "",
        mota: "",
        mucluong: "",
        Ngayhethan: "",
        trangthai: "active",
        MaNTD: "",
      });
    } catch (error) {
      console.error("Error adding job post:", error);
    }
  };

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

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Tiêu đề</label>
            <input
              type="text"
              name="tieude"
              value={jobPost.tieude}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập tiêu đề"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mô tả</label>
            <textarea
              name="mota"
              value={jobPost.mota}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập mô tả công việc"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mức lương</label>
            <input
              type="text"
              name="mucluong"
              value={jobPost.mucluong}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập mức lương"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Ngày hết hạn</label>
            <input
              type="date"
              name="Ngayhethan"
              value={jobPost.Ngayhethan}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Trạng thái</label>
            <select
              name="trangthai"
              value={jobPost.trangthai}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Chờ duyệt</option>
              <option value="active">Đã duyệt</option>
              <option value="expired">Hết hạn</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Nhà tuyển dụng</label>
            <select
              name="MaNTD"
              value={jobPost.MaNTD}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Chọn nhà tuyển dụng --</option>
              {recruiters.map((recruiter) => (
                <option key={recruiter.id} value={recruiter.id}>
                  {recruiter.ten}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
      </form>

      <table className="min-w-full bg-white border rounded-lg mt-6 shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Tiêu đề</th>
            <th className="px-4 py-2">Mô tả</th>
            <th className="px-4 py-2">Mức lương</th>
            <th className="px-4 py-2">Ngày hết hạn</th>
            <th className="px-4 py-2">Trạng thái</th>
            <th className="px-4 py-2">Nhà tuyển dụng</th>
          </tr>
        </thead>
        <tbody>
          {jobPosts.map((post) => (
            <tr key={post.MaTTD} className="border-b">
              <td className="px-4 py-2">{post.tieude}</td>
              <td className="px-4 py-2">{post.mota}</td>
              <td className="px-4 py-2">{post.mucluong}</td>
              <td className="px-4 py-2">
                {new Date(post.Ngayhethan).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{post.trangthai}</td>
              <td className="px-4 py-2">
                {recruiters.find((rec) => rec.id === post.MaNTD)?.ten || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
