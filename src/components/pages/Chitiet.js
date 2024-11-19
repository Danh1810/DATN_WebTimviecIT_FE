import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { Modal, Button } from "antd";
import { getTintdbyID } from "../services/jb.service";

function JobDetails() {
  const [activeTab, setActiveTab] = useState("details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState(null);
  const { id } = useParams(); // Get the job ID from URL
  console.log("🚀 ~ JobDetails ~ id:", id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // Fetch job details by ID
  const fetchJobDetails = async () => {
    try {
      setLoading(true); // Start loading
      const response = await getTintdbyID(id); // Make API call
      // const response = await axios.get("/tintd/details", {
      //   params: { id: id },
      // });
      console.log("🚀 ~ fetchJobDetails ~ response:", response.data);
      setJob(response.data); // Set job details
    } catch (err) {
      console.error("Error fetching job details:", err);
      setError("Không thể tải thông tin tuyển dụng."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchJobDetails(); // Fetch job details on component mount or id change
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, phone });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto flex gap-8">
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
                <>
                  {/* Job Details */}
                  <h1 className="text-2xl font-bold mb-4">
                    {job?.title || "Thông tin tuyển dụng"}
                  </h1>
                  <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                    <div>
                      <strong>Ngày đăng:</strong> {job?.tieude || "N/A"}
                    </div>
                    <div>
                      <strong>Cấp bậc:</strong> {job?.level || "N/A"}
                    </div>
                    <div>
                      <strong>Số lượng tuyển:</strong> {job?.quantity || "N/A"}
                    </div>
                    <div>
                      <strong>Hình thức làm việc:</strong>{" "}
                      {job?.workType || "N/A"}
                    </div>
                    <div>
                      <strong>Độ tuổi:</strong> {job?.ageRequirement || "N/A"}
                    </div>
                    <div>
                      <strong>Yêu cầu bằng cấp:</strong>{" "}
                      {job?.education || "N/A"}
                    </div>
                    <div>
                      <strong>Yêu cầu kinh nghiệm:</strong>{" "}
                      {job?.experience || "N/A"}
                    </div>
                    <div>
                      <strong>Ngành nghề:</strong> {job?.industry || "N/A"}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Mô tả công việc
                    </h2>
                    <p className="text-gray-700">
                      {job?.description || "Thông tin không có sẵn."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Nộp hồ sơ
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
                      Lưu
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  {/* Company Info */}
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

        {/* Similar Jobs */}
        <aside className="w-64 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Việc làm tương tự
          </h3>
          {similarJobs.map((job, index) => (
            <div key={index} className="mb-4 p-3 border rounded-lg shadow-sm">
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
        </aside>
      </div>

      {/* Modal */}
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
        </form>
      </Modal>
    </div>
  );
}

export default JobDetails;
