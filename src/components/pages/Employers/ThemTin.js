import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "../../services/axios";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [jobPost, setJobPost] = useState({
    tieude: "",
    mota: "",
    mucluong: "",
    Ngayhethan: "",
    trangthai: "Chờ duyệt",
    kinhNghiem: "",
    loaiHopdong: "",
    diaChiLamviec: "",
    Kynang: [],
    Capbac: [],
  });

  const [jobPosts, setJobPosts] = useState([]);
  const [skills, setSkills] = useState([]); // Quản lý danh sách kỹ năng
  const [levels, setLevels] = useState([]); // Quản lý danh sách cấp bậc
  const [recruiters, setRecruiters] = useState([]);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPost((prev) => ({ ...prev, [name]: value }));
  };
  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("/nhatd");
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
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
      console.log("🚀 ~ handleSubmit ~ postData:", postData);
      const response = await axios.post("/tintd", postData);
      console.log("🚀 ~ handleSubmit ~ postData:", postData);
      setJobPosts((prev) => [...prev, response.data]);
      setJobPost({
        tieude: "",
        mota: "",
        mucluong: "",
        Ngayhethan: "",
        trangthai: "active",
        kinhNghiem: "",
        loaiHopdong: "",
        diaChiLamviec: "",
        Kynang: [],
        Capbac: [],
      });
      toast.success("Đăng thành công hãy chờ quản trị viên duyệt");
    } catch (error) {
      console.error("Error adding job post:", error);
    }
  };
  useEffect(() => {
    fetchJobPosts();
    fetchSkills();
    fetchLevels();
    fetchRecruiters();
  }, []);

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-2xl font-bold text-center mb-6">
        Đăng tin tuyển dụng
      </h1>

      {/* Label số lượng đăng tuyển */}
      <div className="absolute top-0 left-0 bg-blue-100 text-blue-600 px-4 py-2 rounded-tr-lg rounded-bl-lg shadow-md">
        Số lượng đăng tuyển:{" "}
        {recruiters.find((rec) => rec.id === 1)?.Soluongdangbai || "N/A"}
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
            <label className="block font-semibold mb-1">Kinh nghiệm</label>
            <input
              type="text"
              name="kinhNghiem"
              value={jobPost.kinhNghiem}
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
              name="loaiHopdong"
              value={jobPost.loaiHopdong}
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
