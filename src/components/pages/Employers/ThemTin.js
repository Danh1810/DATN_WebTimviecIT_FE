import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "../../services/axios";

function App() {
  const [jobPost, setJobPost] = useState({
    tieude: "",
    mota: "",
    mucluong: "",
    Ngayhethan: "",
    trangthai: "active",
    kinhnghiem: "",
    loaihopdong: "",
    diaChiLamviec: "",
    Kynang: [],
    Capbac: [],
  });

  const [jobPosts, setJobPosts] = useState([]);
  const [skills, setSkills] = useState([]); // Quản lý danh sách kỹ năng
  const [levels, setLevels] = useState([]); // Quản lý danh sách cấp bậc

  // Fetch danh sách bài tuyển dụng
  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  // Fetch danh sách kỹ năng
  const fetchSkills = async () => {
    try {
      const response = await axios.get("/kynang");
      const formattedSkills = response.data.map((skill) => ({
        value: skill.id,
        label: skill.ten,
      }));
      setSkills(formattedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  // Fetch danh sách cấp bậc
  const fetchLevels = async () => {
    try {
      const response = await axios.get("/capbac");
      const formattedLevels = response.data.map((level) => ({
        value: level.id,
        label: level.ten,
      }));
      setLevels(formattedLevels);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  useEffect(() => {
    fetchJobPosts();
    fetchSkills();
    fetchLevels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions, { name }) => {
    setJobPost((prev) => ({ ...prev, [name]: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...jobPost,
        Kynang: jobPost.Kynang.map((k) => k.value),
        Capbac: jobPost.Capbac.map((l) => l.value),
      };
      const response = await axios.post("/tintd", postData);
      setJobPosts((prev) => [...prev, response.data]);
      setJobPost({
        tieude: "",
        mota: "",
        mucluong: "",
        Ngayhethan: "",
        trangthai: "active",
        kinhnghiem: "",
        loaihopdong: "",
        diaChiLamviec: "",
        Kynang: [],
        Capbac: [],
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
            <label className="block font-semibold mb-1">Kinh nghiệm</label>
            <input
              type="text"
              name="kinhnghiem"
              value={jobPost.kinhnghiem}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập kinh nghiệm (VD: 3-5 năm)"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Địa chỉ làm việc</label>
            <input
              type="text"
              name="diaChiLamviec"
              value={jobPost.diaChiLamviec}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập địa chỉ làm việc"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Loại hợp đồng</label>
            <select
              name="loaihopdong"
              value={jobPost.loaihopdong}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn loại hợp đồng</option>
              <option value="Toàn thời gian">Toàn thời gian</option>
              <option value="Bán thời gian">Bán thời gian</option>
              <option value="Hợp đồng thời vụ">Hợp đồng thời vụ</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Kỹ năng</label>
            <Select
              name="Kynang"
              isMulti
              options={skills}
              value={jobPost.Kynang}
              onChange={handleMultiSelectChange}
              placeholder="Chọn kỹ năng"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Cấp bậc</label>
            <Select
              name="Capbac"
              isMulti
              options={levels}
              value={jobPost.Capbac}
              onChange={handleMultiSelectChange}
              placeholder="Chọn cấp bậc"
            />
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
