import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";
import Select from "react-select";
const CVManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const id = localStorage.getItem("id");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [hoso, sethoso] = useState([]);
  const [loading, setLoading] = useState({});
  const [formData, setFormData] = useState({
    tenhoso: "",
    kyNangLapTrinh: [],
    capBacHienTai: "",
    mucTieuNgheNghiep: "",
    trinhDoHocVan: "",
    duAnDaThamGia: "",
    fileHoso: "",
    ngayCapNhat: "",
    kinhNghiemLamViec: "",
    Mucluongmongmuon: "",
    hinhThuclamviec: "",
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
      console.log("🚀 ~ fetchhoso ~ hoso:", hoso);
      sethoso(hoso);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    }
  };
  const programmingSkills = [
    { value: "Javascript", label: "JavaScript" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "Csharp", label: "C#" },
    { value: "Php", label: "PHP" },
    { value: "Ruby", label: "Ruby" },
    { value: "Golang", label: "Golang" },
    { value: "Swift", label: "Swift" },
    { value: "Kotlin", label: "Kotlin" },
  ];
  const options = programmingSkills.map((skill) => ({
    value: skill.value,
    label: skill.label,
  }));
  const workTypes = [
    { value: "Toàn thời gian", label: "Toàn thời gian" },
    { value: "Bán thời gian", label: "Bán thời gian" },
    { value: "Hợp đồng thời vụ", label: "Hợp đồng thời vụ" },
  ];

  const levels = [
    { value: "Fresher", label: "Fresher" },
    { value: "Junior", label: "Junior" },
    { value: "Middle", label: "Middle" },
    { value: "Senior", label: "Senior" },
    { value: "Teamlead", label: "Team Lead" },
    { value: "Manager", label: "Manager" },
  ];
  const [selectedhosoNTV, setSelectedhoNTV] = useState(null);
  const handleSkillsChange = (selectedSkills) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      kyNangLapTrinh: selectedSkills,
    }));
  };
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
  const [fileError, setFileError] = useState("");

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
      const file = files[0];

      // Kiểm tra kích thước file
      if (file.size > 5 * 1024 * 1024) {
        // 5MB in bytes
        setFileError("Kích thước file không được vượt quá 5MB.");
        e.target.value = null; // Reset file input
      } else {
        setFileError(""); // Clear any previous error messages
        setFormData((prev) => ({ ...prev, [name]: file }));
        setPreviewImage(URL.createObjectURL(file));
      }
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
    setEditId(null);
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
  const togglePublic = async (id, currentStatus) => {
    console.log("🚀 ~ togglePublic ~ currentStatus:", currentStatus);
    // Đặt trạng thái loading cho CV cụ thể
    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      // Gọi API để cập nhật trạng thái
      const response = await axios.put("/hoso/tt", {
        id: id,
        timkiem: !currentStatus,
      });
      console.log("🚀 ~ togglePublic ~ response.status:", response);
      if (response.code === 0) {
        // Cập nhật state local sau khi API thành công
        sethoso((prevHoso) =>
          prevHoso.map((cv) =>
            cv.id === id ? { ...cv, timkiem: !currentStatus } : cv
          )
        );

        // Hiển thị thông báo thành công
        toast.success(
          `CV đã được ${!currentStatus ? "công khai" : "ẩn"} thành công`
        );
      }
    } catch (error) {
      // Xử lý các loại lỗi
      console.error("Lỗi khi cập nhật trạng thái:", error);

      let errorMessage = "Đã có lỗi xảy ra khi cập nhật trạng thái";

      if (error.response) {
        // Lỗi từ server
        switch (error.response.status) {
          case 400:
            errorMessage = "Yêu cầu không hợp lệ";
            break;
          case 401:
            errorMessage = "Bạn cần đăng nhập lại";
            break;
          case 403:
            errorMessage = "Bạn không có quyền thực hiện thao tác này";
            break;
          case 404:
            errorMessage = "Không tìm thấy CV";
            break;
          default:
            errorMessage = "Lỗi server, vui lòng thử lại sau";
        }
      }

      toast.error(errorMessage);

      // Rollback trạng thái nếu có lỗi
      sethoso((prevHoso) =>
        prevHoso.map((cv) =>
          cv.id === id ? { ...cv, timkiem: currentStatus } : cv
        )
      );
    } finally {
      // Tắt trạng thái loading
      setLoading((prev) => ({ ...prev, [id]: false }));
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
              <th className="px-4 py-2">Hiển thị cho NTD</th>
              <th className="px-4 py-2">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {hoso.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-4 text-center text-gray-500 bg-gray-50"
                  colSpan="5"
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
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={hs.timkiem}
                        onChange={() => togglePublic(hs.id, hs.timkiem)}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                                  peer-checked:after:translate-x-full after:content-[''] 
                                  after:absolute after:top-0.5 after:left-[2px] after:bg-white 
                                  after:border-gray-300 after:border after:rounded-full after:h-5 
                                  after:w-5 after:transition-all peer-checked:bg-blue-600"
                      ></div>
                      <span className="ml-2 text-sm text-gray-600">
                        {hs.timkiem ? "Công khai" : "Riêng tư"}
                      </span>
                    </label>
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
        </table>
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
              <div className="mb-4">
                <label className="block font-medium">Tên hồ sơ</label>
                <input
                  type="text"
                  name="tenhoso"
                  value={formData.tenhoso}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">
                  Kỹ năng lập trình
                </label>
                <Select
                  isMulti
                  name="kyNangLapTrinh"
                  options={options}
                  className="w-full"
                  value={options.filter((option) =>
                    formData.kyNangLapTrinh.includes(option.value)
                  )}
                  onChange={(selectedOptions) => {
                    const selectedValues = selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : [];
                    handleSkillsChange(selectedValues);
                  }}
                  placeholder="Chọn kỹ năng lập trình..."
                  noOptionsMessage={() => "Không có lựa chọn nào"}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Hình thức làm việc</label>
                <select
                  name="hinhThuclamviec"
                  value={formData.hinhThuclamviec}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Chọn hình thức làm việc</option>
                  {workTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Cấp bậc hiện tại</label>
                <select
                  name="capBacHienTai"
                  value={formData.capBacHienTai}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Chọn cấp bậc</option>
                  {levels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="block font-medium">Trình độ học vấn</label>
                <select
                  name="trinhDoHocVan"
                  value={formData.trinhDoHocVan}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">-- Chọn trình độ học vấn --</option>
                  <option value="Trung cấp">Trung cấp</option>
                  <option value="Cao đẳng">Cao đẳng</option>
                  <option value="Đại học">Đại học</option>
                  <option value="Thạc sĩ">Thạc sĩ</option>
                  <option value="Tiến sĩ">Tiến sĩ</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Mức lương mong muốn</label>
                <select
                  name="Mucluongmongmuon"
                  value={formData.Mucluongmongmuon}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">-- Chọn mức lương mong muốn --</option>
                  <option value="5000000">Dưới 5 triệu</option>
                  <option value="10000000">5 - 10 triệu</option>
                  <option value="20000000">10 - 20 triệu</option>
                  <option value="30000000">20 - 30 triệu</option>
                  <option value="30000001">Trên 30 triệu</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium">
                  Kinh nghiệm làm việc
                </label>
                <select
                  name="kinhNghiemLamViec"
                  value={formData.kinhNghiemLamViec}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">-- Chọn kinh nghiệm làm việc --</option>
                  <option value="Chưa có kinh nghiệm">
                    Chưa có kinh nghiệm
                  </option>
                  <option value="Dưới 1 năm">Dưới 1 năm</option>
                  <option value="1-3 năm">1-3 năm</option>
                  <option value="3-5 năm">3-5 năm</option>
                  <option value="Trên 5 năm">Trên 5 năm</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Dự án đã tham gia</label>
                <textarea
                  name="duAnDaThamGia"
                  value={formData.duAnDaThamGia}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Tải lên CV</label>
                <input
                  type="file"
                  name="fileHoso"
                  onChange={handleFileChange}
                  className="w-full border rounded px-2 py-1"
                />
                {fileError && (
                  <p className="text-red-500 text-sm">{fileError}</p>
                )}
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
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
                        {selectedhosoNTV.kyNangLapTrinh
                          ? Array.isArray(selectedhosoNTV.kyNangLapTrinh)
                            ? selectedhosoNTV.kyNangLapTrinh.join(", ")
                            : selectedhosoNTV.kyNangLapTrinh
                          : "Chưa nhập"}
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
