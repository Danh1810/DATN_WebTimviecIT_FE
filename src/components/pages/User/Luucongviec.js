import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { Link } from "react-router-dom";

const Luucongviec = () => {
  const [profiles, setProfiles] = useState([]);
  const id = localStorage.getItem("id");
  const [isOpen, setIsOpen] = useState(false);
  const [jobSeekers, setJobSeekers] = useState([]);
  const [isXem, setisxem] = useState(false);
  const [lcv, setlcv] = useState([]); // Danh sách hồ sơ
  const [formData, setFormData] = useState({
    anhDaiDien: "",
    hoVaTen: "",
    ngaySinh: "",
    thanhPho: "",
    diaChi: "",
    gioiTinh: "",
    soDienThoai: "",
    kyNangLapTrinh: "",
    capBacHienTai: "",
    mucTieuNgheNghiep: "",
    chungChiNgheNghiep: "",
    duAnDaThamGia: "",
    linkHoSoOnline: "",
    ngayCapNhat: "",
  });
  const [jobPosts, setJobPosts] = useState([]);
  const [editId, setEditId] = useState(null); // ID hồ sơ đang chỉnh sửa
  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };
  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };
  const fetchlcv = async () => {
    try {
      const response = await axios.get("/ngtviec/lcv", { params: { id: id } });
      console.log("🚀 ~ fetchlcv ~ response:", response);
      const lcv = response.data[0]?.LCV_NTV || []; // Safely access the nested `hoso` array
      setlcv(lcv);
      console.log("🚀 ~ fetchlcv ~ lcv:", lcv);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    fetchlcv();
    fetchJobSeekers();
    fetchJobPosts();
  }, []);

  return (
    <div>
      <div className="container mx-auto p-4 min-h-screen">
        {lcv.map((item) => {
          // Tìm tin tuyển dụng tương ứng
          const jobPost = jobPosts.find((rec) => rec.id === item.MaTTD);

          // Kiểm tra nếu không tìm thấy tin tuyển dụng
          if (!jobPost) return null;

          return (
            <Link key={jobPost.id} to={`/tintuyendung/${jobPost.id}`}>
              <div className="border rounded-lg p-4 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow">
                {/* Nội dung bên trong div */}
                <div className="flex items-start">
                  {/* Logo */}
                  <div className="mr-4">
                    <img
                      src={jobPost.employer?.logo || "/default-logo.png"} // Thay "N/A" bằng logo mặc định
                      alt="Company Logo"
                      className="w-12 h-12 object-contain rounded"
                    />
                  </div>
                  {/* Nội dung chính */}
                  <div>
                    <h2 className="text-lg font-bold">
                      {jobPost.tieude || "Không có tiêu đề"}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {jobPost.employer?.ten || "Tên nhà tuyển dụng không có"}
                    </p>
                    {/* Thông tin khác */}
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span className="mr-4">
                        💰{" "}
                        <span className="font-medium">
                          {jobPost.mucluong || "Thỏa thuận"}
                        </span>
                      </span>
                      <span className="mr-4">
                        📍 {jobPost.diaChiLamviec || "Địa chỉ không có"}
                      </span>
                      <span>
                        📅{" "}
                        {jobPost.Ngayhethan
                          ? new Date(jobPost.Ngayhethan).toLocaleDateString()
                          : "Không xác định"}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Phần bên phải */}
                <div>
                  <button className="flex items-center text-red-500 hover:text-red-600 font-medium">
                    ❤️ Hủy lưu
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Luucongviec;
