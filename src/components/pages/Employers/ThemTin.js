import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "../../services/axios";
import { ToastContainer, toast } from "react-toastify";
import Quill from "quill";
import "react-toastify/dist/ReactToastify.css";
import "quill/dist/quill.snow.css";

function App() {
  const id = localStorage.getItem("id");
  const quillRef = useRef(null);

  const [jobPost, setJobPost] = useState({
    tieude: "",
    mota: "",
    mucluong: "",
    trangthai: "Chờ duyệt",
    kinhNghiem: "",
    loaiHopdong: "",
    diaChiLamviec: "",
    Kynang: [],
    Capbac: [],
    Ma: id,
  });

  const [jobPosts, setJobPosts] = useState([]);
  const [skills, setSkills] = useState([]);
  const [levels, setLevels] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [employers, setEmployers] = useState(null);

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      setJobPosts(response.data);
    } catch (error) {
      toast.error("Error fetching job posts");
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get("/kynang");
      const formattedSkills = response.data.map((skill) => ({
        value: skill.id,
        label: skill.ten,
      }));
      setSkills(formattedSkills);
    } catch (error) {
      toast.error("Error fetching skills");
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await axios.get("/capbac");
      const formattedLevels = response.data.map((level) => ({
        value: level.id,
        label: level.ten,
      }));
      setLevels(formattedLevels);
    } catch (error) {
      toast.error("Error fetching levels");
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("/nhatd");
      setRecruiters(response.data);
    } catch (error) {
      toast.error("Error fetching recruiters");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/nhatd/detail", {
        params: { id },
      });
      setEmployers(response.data || null);
    } catch (error) {
      toast.error("Error fetching employer data");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (selectedOptions, { name }) => {
    setJobPost((prev) => ({ ...prev, [name]: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobPost.tieude || !jobPost.mota || !jobPost.mucluong) {
      toast.error("Please fill in all required fields");
      return;
    }

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
        trangthai: "Chờ duyệt",
        kinhNghiem: "",
        loaiHopdong: "",
        diaChiLamviec: "",
        Kynang: [],
        Capbac: [],
        Ma: id,
      });

      toast.success("Job post submitted successfully!");
    } catch (error) {
      toast.error("Error submitting job post");
    }
  };

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
      },
    });

    quill.root.innerHTML = jobPost.mota || "";

    quill.on("text-change", () => {
      handleChange({
        target: { name: "mota", value: quill.root.innerHTML },
      });
    });
  }, []);

  useEffect(() => {
    fetchJobPosts();
    fetchSkills();
    fetchLevels();
    fetchRecruiters();
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 relative">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-6">
        Đăng tin tuyển dụng
      </h1>

      {employers && (
        <div className="absolute top-0 left-0 bg-blue-100 text-blue-600 px-4 py-2 rounded-tr-lg rounded-bl-lg shadow-md">
          Số lượng đăng tuyển: {employers.Soluongdangbai}
        </div>
      )}

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
              name="kinhNghiem"
              value={jobPost.kinhNghiem}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập kinh nghiệm"
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
        <div>
          <label className="block font-semibold mb-1">Mô tả</label>
          <div
            ref={quillRef}
            className="w-full border rounded"
            style={{ minHeight: "150px", padding: "10px" }}
          ></div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Đăng tin
        </button>
      </form>
    </div>
  );
}

export default App;
