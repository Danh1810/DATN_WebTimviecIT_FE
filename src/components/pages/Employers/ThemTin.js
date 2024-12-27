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
    noibatnline: "",
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
    console.log("🚀 ~ handleMultiSelectChange ~ name:", name);
    setJobPost((prev) => ({
      ...prev,
      [name]: selectedOptions, // Đúng với multi-select
    }));
  };

  const handleEditorChange = (content) => {
    setJobPost((prev) => ({ ...prev, mota: content }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jobPosts.noibatnline === true) {
      // Nếu bài đăng đã được đặt nổi bật, kiểm tra số lượng nổi bật
      if (employers.Soluongnoibat === 0) {
        toast.error("Bạn đã hết lượt nổi bật");
        return;
      }
    } else {
      // Nếu bài đăng không nổi bật, kiểm tra số lượng đăng bài
      if (employers.Soluongdangbai === 0) {
        toast.error("Bạn đã hết lượt đăng bài");
        return;
      }
    }

    if (!jobPost.tieude || !jobPost.mota || !jobPost.mucluong) {
      toast.error("Vui lòng không bỏ trống");
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

      // Reset form
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

      toast.success(response.message);
    } catch (error) {
      toast.error("Bài đăng đã được đăng rồi");
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
        <div className="absolute top-0 left-0 flex flex-col gap-2 bg-blue-100 text-blue-700 p-4 rounded-tr-xl rounded-bl-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span className="font-medium">{employers.Soluongdangbai}</span>
            <span className="text-sm">lượt đăng bài bình thường</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{employers.Soluongnoibat}</span>
            <span className="text-sm">lượt đăng bài nổi bật</span>
          </div>
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
                      zIndex: 9999,
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
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
            </div>
            {/* New checkbox for Featured Job */}
            <div>
              <label className="block font-semibold mb-1">Tin nổi bật</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="noibatnline"
                  checked={jobPost.noibatnline || false}
                  onChange={(e) => {
                    handleChange({
                      target: {
                        name: "noibatnline",
                        value: e.target.checked,
                      },
                    });
                  }}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Đánh dấu là tin tuyển dụng nổi bật
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Mô tả</label>
            <Editor
              apiKey="0quscvfjqhtejntlhe93sbs0lzvm10e4lx8eg0yogzutv8jh"
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
