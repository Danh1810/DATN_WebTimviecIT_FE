import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { Modal, Button } from "antd";
import { getTintdbyID } from "../services/jb.service";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { toast } from "react-toastify";
function JobDetails() {
  const [activeTab, setActiveTab] = useState("details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState(null);
  const { id } = useParams(); // Get the job ID from URL
  console.log("🚀 ~ JobDetails ~ id:", id);
  const isAuth = localStorage.getItem("isAuth");
  console.log("🚀 ~ JobDetails ~ isAuth:", isAuth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [isXem, setisxem] = useState([id]);
  const [hoso, sethoso] = useState([]);
  const similarJobs = [
    {
      title: "Front-end Developer",
      company: "Công ty TNHH ABC",
      location: "Hà Nội",
      salary: "8 - 12 triệu",
      deadline: "10/11/2024",
    },
    {
      title: "Front-end Developer",
      company: "Công ty XYZ",
      location: "Đà Nẵng",
      salary: "10 - 15 triệu",
      deadline: "15/11/2024",
    },
    {
      title: "Front-end Developer",
      company: "Công ty TNHH DEF",
      location: "TP. HCM",
      salary: "12 - 18 triệu",
      deadline: "20/11/2024",
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/ngtviec/detail", {
          params: { id: 1 },
        }); // URL API để lấy dữ liệu
        setName(response.data.hoVaTen);
        setPhone(response.data.soDienThoai); // Gán dữ liệu vào state
      } catch (error) {
        console.error("Error fetching saved data:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch job details by ID
  const fetchJobDetails = async () => {
    try {
      setLoading(true); // Start loading
      // const response = await getTintdbyID(id); // Make API call
      const response = await axios.get(`/tintd/details`, {
        params: { id: id },
      });
      console.log("🚀 ~ fetchJobDetails ~ response:", response.data);
      setJob(response.data); // Set job details
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Không thể tải thông tin tuyển dụng."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };
  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };
  const fetchhoso = async () => {
    try {
      const response = await axios.get("/ngtviec/hoso", { params: { id: 5 } });
      const hoso = response.data[0]?.hoso || []; // Safely access the nested `hoso` array
      sethoso(hoso);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    }
  };
  const [selectedHoSoId, setSelectedHoSoId] = useState(null);

  // Hàm xử lý khi chọn hồ sơ
  const handleSelect = (id) => {
    setSelectedHoSoId(id); // Lưu ID hồ sơ được chọn
  };
  const handleNop = () => {
    if (isAuth === "false") {
      toast.error("Bạn càn đăng nhập");
    } else {
      setIsModalOpen(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("MaTTD", id);
    formData.append("MaHS", selectedHoSoId);
    formData.append("trangthai", "Đã nộp");

    try {
      await axios.post("/Ut", formData);
      toast.success("Bạn đã ứng tuyển thành công hãy chú ý mail nhé");
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  useEffect(() => {
    fetchJobDetails();
    fetchJobSeekers();
    fetchhoso();
  }, [id]);

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Job Header */}

        <div className="border rounded-lg p-4 shadow-md bg-white relative z-0">
          {/* Ensure `job` exists before rendering */}
          {job ? (
            <>
              {/* Save Icon */}
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </button>

              {/* Logo & Title */}
              <div
                key={job.id}
                className="flex items-center space-x-6 p-4 bg-white rounded-lg shadow-lg z-0"
              >
                {/* Employer Logo */}
                <img
                  src={job.employer.logo}
                  alt="Employer Logo"
                  className="w-20 h-20 object-contain rounded-full border border-gray-200 bg-gray-100"
                />

                {/* Job Details */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                    {job.tieude}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.employer.ten}
                  </p>
                </div>
              </div>

              {/* Location & Time */}
              <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
                <div className="flex items-center text-gray-700 text-sm">
                  <LocationOnIcon className="text-gray-500 mr-2" />
                  <span className="font-medium">{job.employer.diachi}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm mt-2">
                  <AccessTimeFilledIcon className="text-gray-500 mr-2" />
                  <span className="font-medium">
                    Hạn nộp:{" "}
                    {new Date(job.Ngayhethan).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Salary */}
              <div className="mt-4">
                <p className="text-sm font-medium text-red-500">
                  {job.mucluong}
                </p>
              </div>
            </>
          ) : (
            // Loading or fallback UI if `job` is undefined
            <div className="text-center text-gray-500">
              Loading job details...
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 font-semibold ${
                    activeTab === "details"
                      ? "text-blue-600 border-b-4 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Chi tiết tuyển dụng
                </button>
                <button
                  onClick={() => setActiveTab("company")}
                  className={`pb-2 font-semibold ${
                    activeTab === "company"
                      ? "text-blue-600 border-b-4 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Công ty
                </button>
              </nav>
            </div>

            {loading ? (
              <p>Đang tải thông tin...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <>
                {activeTab === "details" ? (
                  <div key={job.id}>
                    <h1 className="text-2xl font-bold mb-4">
                      {job?.title || "Thông tin tuyển dụng"}
                    </h1>
                    <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                      <div>
                        <strong>Kinh nghiệm</strong> {job?.kinhNghiem || "N/A"}
                      </div>
                      <div>
                        <strong>Cấp bậc : </strong>
                        {job?.levels?.length > 0
                          ? job.levels.map((level, index) => (
                              <span key={level.id || `level-${index}`}>
                                {level.ten || "N/A"}
                                {index < job.levels.length - 1 && ", "}
                              </span>
                            ))
                          : "N/A"}
                      </div>
                      <div>
                        <strong>Loại hợp đồng : </strong>{" "}
                        {job?.loaiHopdong || "N/A"}
                      </div>
                      <div>
                        <strong>Kỹ năng : </strong>
                        {job?.skills?.length > 0
                          ? job.skills.map((skill, index) => (
                              <span key={skill.id || `skill-${index}`}>
                                {skill.ten || "N/A"}
                                {index < job.skills.length - 1 && ", "}
                              </span>
                            ))
                          : "N/A"}
                      </div>
                      <div>
                        <strong>Địa chỉ:</strong> {job?.diaChiLamviec || "N/A"}
                      </div>
                    </div>

                    <div className="mt-6">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Mô tả công việc
                      </h2>
                      <p className="text-gray-700">
                        {job?.mota || "Thông tin không có sẵn."}
                      </p>
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
                        onClick={handleNop}
                      >
                        Nộp hồ sơ
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Thông tin công ty
                    </h2>
                    <p className="text-gray-700">
                      {job?.companyInfo || "Thông tin không có sẵn."}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/*       
          <aside className="w-full lg:w-64 bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Việc làm tương tự
            </h3>
            {similarJobs.map((job, index) => (
              <div
                key={job.title || index}
                className="mb-4 p-3 border rounded-lg shadow-sm"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {job.title}
                </h4>
                <p className="text-sm text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-600">Khu vực: {job.location}</p>
                <p className="text-sm text-gray-600">Mức lương: {job.salary}</p>
                <p className="text-sm text-gray-600">
                  Hạn nộp hồ sơ: {job.deadline}
                </p>
              </div>
            ))}
          </aside> */}
        </div>
      </div>

      <Modal
        title="Nộp hồ sơ"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Nộp hồ sơ"
        cancelText="Hủy"
      >
        <form>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Nguyễn Văn A"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="0123456789"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">
              Hồ sơ <span className="text-red-500"></span>
            </label>
            <div className="bg-white shadow-md p-4 rounded-lg space-y-2">
              {hoso.map((hs) => (
                <div
                  key={hs.id}
                  className={`flex justify-between items-center p-2 border rounded-lg ${
                    selectedHoSoId === hs.id ? "bg-blue-50 border-blue-400" : ""
                  }`}
                >
                  <div>{hs.tenhoso}</div>

                  <input
                    type="radio"
                    name="hoso"
                    value={hs.id}
                    checked={selectedHoSoId === hs.id}
                    onChange={() => handleSelect(hs.id)}
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default JobDetails;
