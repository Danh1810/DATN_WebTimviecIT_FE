import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const CVManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const id = localStorage.getItem("id");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [hoso, sethoso] = useState([]);
  const [formData, setFormData] = useState({
    tenhoso: "",
    kyNangLapTrinh: "",
    capBacHienTai: "",
    mucTieuNgheNghiep: "",
    trinhDoHocVan: "",
    duAnDaThamGia: "",
    fileHoso: "",
    ngayCapNhat: "",
    kinhNghiemLamViec: "",
  });
  const [selectedNTV, setSelectedNTV] = useState(null);
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch Data
  const fetchData = async () => {
    try {
      const response = await axios.get("/ngtviec/detail", {
        params: { id },
      });
      if (response.data) {
        setSelectedNTV(response.data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const [isXem, setisxem] = useState(false);
  const fetchhoso = async () => {
    try {
      const response = await axios.get("/ngtviec/hoso", { params: { id } });
      const hoso = response.data[0]?.hoso || [];
      sethoso(hoso);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    }
  };
  const [selectedhosoNTV, setSelectedhoNTV] = useState(null);

  const xemChiTiet1 = (id) => {
    const post = hoso.find((post) => post.id === id);
    setSelectedhoNTV(post); // Lưu bài đăng được chọn vào state
    console.log("🚀 ~ CVManagement ~ selectedhosoNTV:", selectedhosoNTV);
  };

  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };

  const handleAddhoso = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.tenhoso) {
      toast.error("Vui lòng nhập tên hồ sơ");
      return;
    }

    // Validate that a file is selected if required
    if (!formData.fileHoso) {
      toast.error("Vui lòng chọn file hồ sơ");
      return;
    }

    // Validate selected NTV
    if (!selectedNTV || !selectedNTV.id) {
      toast.error("Vui lòng chọn người tìm việc");
      return;
    }

    const formDataToSend = new FormData();

    // Append all form data entries
    Object.entries(formData).forEach(([key, value]) => {
      // Only append non-empty values
      if (value !== "" && value !== null && value !== undefined) {
        formDataToSend.append(key, value);
      }
    });

    // Always append NguoitimviecId
    formDataToSend.append("NguoitimviecId", selectedNTV.id);
    console.log("🚀 ~ handleAddhoso ~ formDataToSend:", formDataToSend);
    try {
      // Show loading toast

      // Send POST request
      const response = await axios.post("/hoso", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Close loading toast

      // Reset form and state
      setIsOpen(false);
      setFormData({
        kyNangLapTrinh: "",
        capBacHienTai: "",
        mucTieuNgheNghiep: "",
        duAnDaThamGia: "",
        fileHoso: null,
        trinhDoHocVan: "",
        kinhNghiemLamViec: "",
        tenhoso: "",
      });

      // Show success message
      toast.success("Tạo hồ sơ thành công");

      // Reload the CV list
      fetchhoso();
    } catch (error) {
      // Handle specific error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          error.response.data.message || "Tạo hồ sơ thất bại";
        toast.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("Không có phản hồi từ máy chủ");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Lỗi khi tạo hồ sơ");
      }

      console.error("Error adding CV:", error);
    }
  };

  const handleUpdateCV = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      await axios.put("hoso/update", formDataToSend);
      toast.success("Cập nhật hồ sơ thành công");
      setIsOpen(false); // Close modal after update
      fetchhoso(); // Reload CVs
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Cập nhật hồ sơ thất bại");
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const xemChiTiet = (id) => {
    const post = hoso.find((post) => post.id === id);
    setFormData(post);
    setEditId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      anhDaiDien: "",
      hoVaTen: "",
      ngaySinh: "",
      thanhPho: "",
      diaChi: "",
      gioiTinh: "",
      soDienThoai: "",
      tenhoso: "",
      kyNangLapTrinh: "",
      capBacHienTai: "",
      mucTieuNgheNghiep: "",
      trinhDoHocVan: "",
      duAnDaThamGia: "",
      fileHoso: "",
      ngayCapNhat: "",
      kinhNghiemLamViec: "",
    });
  };
  const Xoahoso = async (id) => {
    try {
      const response = await axios.delete("/hoso", {
        params: { id: id },
      });
      console.log("🚀 ~ handleSua ~ response:", response);
      if (response.code === 0) {
        fetchhoso();
        alert("Xóa thành công!");
      } else {
        alert("Đã xảy ra lỗi khi xóa");
      }
    } catch (error) {
      console.error("Lỗi xóa", error);
    }
  };
  const closeModal1 = () => {
    setSelectedhoNTV(null);
  };
  useEffect(() => {
    fetchhoso();
    fetchJobSeekers();
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <button
        onClick={toggleModal}
        className="bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
      >
        <span>Tạo hồ sơ</span>
      </button>

      <div className="bg-white-100 p-4 rounded">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="text-gray-600 font-medium bg-gray-100">
              <th className="px-4 py-2">Tên CV</th>
              <th className="px-4 py-2">Trạng thái CV</th>
              <th className="px-4 py-2">Lần chỉnh sửa cuối</th>
              <th className="px-4 py-2">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {hoso.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-center text-gray-500 bg-gray-50"
                  colSpan="4"
                >
                  Bạn chưa có CV
                </td>
              </tr>
            ) : (
              hoso.map((hs) => (
                <tr
                  key={hs.id}
                  className="text-gray-800 hover:bg-gray-50 transition"
                >
                  <td className="border-t px-4 py-3">{hs.tenhoso}</td>
                  <td className="border-t px-4 py-3">{hs.trangthai}</td>
                  <td className="border-t px-4 py-3">
                    {new Date(hs.ngayCapNhat).toLocaleDateString()}
                  </td>
                  <td className="border-t px-4 py-3">
                    <div className="flex space-x-3">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        onClick={() => xemChiTiet(hs.id)}
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        onClick={() => xemChiTiet1(hs.id)}
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition"
                        onClick={() => Xoahoso(hs.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>{" "}
        *
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="container mx-auto p-4 bg-white max-h-[90vh] overflow-y-auto">
            <form
              className="mb-6 p-4 border rounded shadow"
              onSubmit={editId ? handleUpdateCV : handleAddhoso}
            >
              <h2 className="text-xl font-semibold mb-4">
                {editId ? "Chỉnh sửa hồ sơ" : "Thêm mới hồ sơ"}
              </h2>

              <div>
                <label className="block font-medium">Tên hồ sơ</label>
                <input
                  type="text"
                  name="tenhoso"
                  value={formData.tenhoso}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-medium">Kỹ năng lập trình</label>
                <input
                  type="text"
                  name="kyNangLapTrinh"
                  value={formData.kyNangLapTrinh}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-medium">Cấp bậc hiện tại</label>
                <input
                  type="text"
                  name="capBacHienTai"
                  value={formData.capBacHienTai}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-medium">
                  Mục tiêu nghề nghiệp
                </label>
                <input
                  type="text"
                  name="mucTieuNgheNghiep"
                  value={formData.mucTieuNgheNghiep}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-medium">Trình độ học vấn</label>
                <input
                  type="text"
                  name="trinhDoHocVan"
                  value={formData.trinhDoHocVan}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-medium">
                  Kinh nghiệm làm việc
                </label>
                <textarea
                  name="kinhNghiemLamViec"
                  value={formData.kinhNghiemLamViec}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div>
                <label className="block font-medium">Dự án đã tham gia</label>
                <textarea
                  name="duAnDaThamGia"
                  value={formData.duAnDaThamGia}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div>
                <label className="block font-medium">Tải lên CV</label>
                <input
                  type="file"
                  name="fileHoso"
                  onChange={handleFileChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>

              <div className="mt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editId ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedhosoNTV && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gray-100 p-5 border-b flex justify-between items-center rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedhosoNTV.tenhoso}
              </h2>
              <button
                onClick={closeModal1}
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content Container */}
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                  <img
                    src={
                      jobSeekers.find(
                        (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                      )?.anhDaiDien || "N/A"
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                    )?.hoVaTen || "N/A"}
                  </h3>
                  <p className="text-gray-600">
                    {selectedhosoNTV.capBacHienTai || "Chưa xác định"}
                  </p>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Thông Tin Cá Nhân
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Ngày Sinh:
                      </label>
                      <p className="text-gray-900">
                        {(() => {
                          const ngaySinh = jobSeekers.find(
                            (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                          )?.ngaySinh;

                          return ngaySinh
                            ? new Date(ngaySinh).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : "N/A";
                        })()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Giới Tính:
                      </label>
                      <p className="text-gray-900">
                        {jobSeekers.find(
                          (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                        )?.gioiTinh || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Địa chỉ:
                      </label>
                      <p className="text-gray-900">
                        {jobSeekers.find(
                          (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                        )?.diaChi || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Thông Tin Liên Hệ
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Số điện thoại:
                      </label>
                      <p className="text-gray-900">
                        {jobSeekers.find(
                          (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                        )?.soDienThoai || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Tỉnh/Thành phố:
                      </label>
                      <p className="text-gray-900">
                        {jobSeekers.find(
                          (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                        )?.thanhPho || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Skills */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Kỹ Năng Nghề Nghiệp
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Kỹ năng lập trình:
                      </label>
                      <p className="text-gray-900">
                        {selectedhosoNTV.kyNangLapTrinh || "Chưa nhập"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Chứng chỉ nghề nghiệp:
                      </label>
                      <p className="text-gray-900">
                        {selectedhosoNTV.chungChiNgheNghiep || "Chưa nhập"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Trình độ học vấn:
                      </label>
                      <p className="text-gray-900">
                        {selectedhosoNTV.trinhDoHocVan || "Chưa nhập"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience and Projects */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Kinh Nghiệm & Dự Án
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Kinh nghiệm làm việc:
                      </label>
                      <p className="text-gray-900">
                        {selectedhosoNTV.kinhNghiemLamViec || "Chưa nhập"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">
                        Dự án đã tham gia:
                      </label>
                      <p className="text-gray-900">
                        {selectedhosoNTV.duAnDaThamGia || "Chưa nhập"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Objective */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  Mục Tiêu Nghề Nghiệp
                </h4>
                <p className="text-gray-900">
                  {selectedhosoNTV.mucTieuNgheNghiep || "Chưa nhập"}
                </p>
              </div>

              {/* Online Profile */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Hồ sơ trực tuyến
                  </label>
                  <p className="text-gray-900">
                    {selectedhosoNTV.fileHoso ? "Có" : "Không"}
                  </p>
                </div>
                {selectedhosoNTV.fileHoso && (
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() =>
                      window.open(selectedhosoNTV.fileHoso, "_blank")
                    }
                  >
                    Xem hồ sơ
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManagement;
