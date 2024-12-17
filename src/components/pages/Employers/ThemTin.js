import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "../../services/axios";
import { ToastContainer, toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const id = localStorage.getItem("id");

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

  const fetchData = async () => {
    try {
      const response = await axios.get("/nhatd/detail", {
        params: { id: id },
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

  const handleEditorChange = (content) => {
    setJobPost((prev) => ({ ...prev, mota: content }));
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
    fetchJobPosts();
    fetchSkills();
    fetchLevels();
    fetchData();
  }, [id]);

  if (!employers) {
    return <div>Loading...</div>;
  }

  const canPostJob = employers && employers.trangthai !== "Chờ duyệt";

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

      {!canPostJob ? (
        <label className="block text-center text-red-500">
          Doanh nghiệp chưa được kiểm duyệt
        </label>
      ) : (
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
              <label className="block font-semibold mb-1">
                Địa chỉ làm việc
              </label>
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
              <div className="relative z-10">
                <Select
                  name="Kynang"
                  isMulti
                  options={skills}
                  value={jobPost.Kynang}
                  onChange={handleMultiSelectChange}
                  placeholder="Chọn kỹ năng"
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999, // Ensure dropdown is above other elements
                    }),
                  }}
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold mb-1">Cấp bậc</label>
              <div className="relative z-10">
                <Select
                  name="Capbac"
                  isMulti
                  options={levels}
                  value={jobPost.Capbac}
                  onChange={handleMultiSelectChange}
                  placeholder="Chọn cấp bậc"
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999, // Ensure dropdown is above other elements
                    }),
                  }}
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Mô tả</label>
            <Editor
              apiKey="hmiu80d3r5jkhc7nvtrs6d0v221yd3esxb0cc9qo6owjail8"
              value={jobPost.mota}
              onEditorChange={handleEditorChange}
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
              }}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Đăng tin
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
