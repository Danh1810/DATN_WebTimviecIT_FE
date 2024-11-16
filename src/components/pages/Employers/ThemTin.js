import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function App() {
  const [jobPost, setJobPost] = useState({
    tieude: "",
    mota: "",
    mucluong: "",
    Ngayhethan: "",
    trangthai: "active",
    MaNTD: "",
  });

  const [jobPosts, setJobPosts] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

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
        Đăng tin tuyển dụng
      </h1>

      <div className="text-right mb-4"></div>

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
          {/* <div>
            <label className="block font-semibold mb-1">Kinh nghiệm</label>
            <input
              type="text"
              name="mucluong"
              value={jobPost.mucluong}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập mức lương"
            />
          </div> */}
          {/* <div>
            <label className="block font-semibold mb-1">Địa chỉ</label>
            <input
              type="text"
              name="mucluong"
              value={jobPost.mucluong}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập mức lương"
            />
          </div> */}
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
            <label className="block font-semibold mb-1">Kỹ năng </label>
            <select
              name="trangthai"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Java</option>
              <option value="active">Python</option>
              <option value="expired">Nodejs</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Cập bậc</label>
            <select
              name="trangthai"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Intern</option>
              <option value="active">Fresher</option>
              <option value="expired">Leader</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đăng
        </button>
      </form>
    </div>
  );
}

export default App;
