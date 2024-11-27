import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { useSelector, useDispatch } from "react-redux";

const ProfileForm = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const auth = useSelector((state) => state.auth);
  console.log("🚀 ~ ProfileForm ~ auth:", auth);
  const id = localStorage.getItem("id");
  console.log("🚀 ~ ProfileForm ~ id:", id);
  const [formData, setFormData] = useState({
    anhDaiDien: "",
    hoVaTen: "",
    ngaySinh: "",
    thanhPho: "",
    diaChi: "",
    gioiTinh: "",
    soDienThoai: "",
  });

  const [editId, setEditId] = useState(null); // ID của hồ sơ đang chỉnh sửa

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // const reportError = async (error) => {
  //   // Gửi lỗi tới server log hoặc dịch vụ logging (ví dụ: Sentry, LogRocket)
  //   await axios.post("/log", { error: error.message });
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/ngtviec/detail", {
          params: { id: id },
        });

        if (!response.data || Object.keys(response.data).length === 0) {
          setSavedData(null);
        } else {
          setSavedData(response.data);
        }
      } catch (error) {
        console.error(error); // Gửi lỗi đi
      }
    };

    fetchData();
  }, []);

  // Xử lý thay đổi file
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };

  // Xử lý thêm ứng viên mới
  const handleAddJobSeeker = async (e) => {
    e.preventDefault();

    // Kiểm tra xem đã chọn ảnh hay chưa
    if (!formData.anhDaiDien) {
      console.error("Chưa chọn ảnh đại diện!");
      return;
    }

    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("hoVaTen", formData.hoVaTen);
    formDataToSend.append("ngaySinh", formData.ngaySinh);
    formDataToSend.append("thanhPho", formData.thanhPho);
    formDataToSend.append("diaChi", formData.diaChi);
    formDataToSend.append("gioiTinh", formData.gioiTinh);
    formDataToSend.append("soDienThoai", formData.soDienThoai);
    formDataToSend.append("anhDaiDien", formData.anhDaiDien);

    try {
      // Gửi formData với kiểu dữ liệu multipart/form-data
      const response = await axios.post("/ngtviec", formDataToSend);
      setSavedData(response.data);
      // Reset form sau khi thêm thành công
      setFormData({
        anhDaiDien: "",
        hoVaTen: "",
        ngaySinh: "",
        thanhPho: "",
        diaChi: "",
        gioiTinh: "",
        soDienThoai: "",
      });
      setEditId(null); // Đặt lại trạng thái chỉnh sửa
    } catch (error) {
      console.error("Error adding job seeker:", error);
    }

    console.log("🚀 ~ handleAddJobSeeker ~ formData:", formData.anhDaiDien);
  };
  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

      {/* Nếu chưa có dữ liệu đã lưu thì hiển thị form */}
      {!savedData ? (
        <form className="mb-6 p-4 border rounded shadow">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border mb-4">
              <img
                src={
                  previewImage ||
                  formData.anhDaiDien ||
                  "https://res.cloudinary.com/dlxczbtva/image/upload/v1704720124/oneweedshop/vcgfoxlfcoipwxywcimv.jpg"
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              name="anhDaiDien"
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          {/* Các trường trong form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Họ và Tên</label>
              <input
                type="text"
                name="hoVaTen"
                value={formData.hoVaTen}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>

            <div>
              <label className="block font-medium">Ngày Sinh</label>
              <input
                type="date"
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium">Tỉnh/Thành phố</label>
              <input
                type="text"
                name="thanhPho"
                value={formData.thanhPho}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium">Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={formData.diaChi}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium">Giới Tính</label>
              <select
                name="gioiTinh"
                value={formData.gioiTinh}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Số điện thoại</label>
              <input
                type="text"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
          </div>

          <button
            onClick={handleAddJobSeeker}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editId ? "Cập nhật" : "Lưu"}
          </button>
        </form>
      ) : (
        // Hiển thị thông tin đã lưu với cấu trúc tương tự form
        <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Ảnh đại diện */}
            <div className="flex-shrink-0">
              <img
                src={savedData.anhDaiDien || "https://via.placeholder.com/150"}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow-sm"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Ảnh đại diện
              </p>
            </div>
            {/* Thông tin cá nhân */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Họ và Tên
                  </label>
                  <div className="text-gray-800 font-medium">
                    {savedData.hoVaTen || "Chưa cập nhật"}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Ngày Sinh
                  </label>
                  <div className="text-gray-800 font-medium">
                    {savedData.ngaySinh || "Chưa cập nhật"}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Tỉnh/Thành phố
                  </label>
                  <div className="text-gray-800 font-medium">
                    {savedData.thanhPho || "Chưa cập nhật"}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Địa chỉ
                  </label>
                  <div className="text-gray-800 font-medium">
                    {savedData.diaChi || "Chưa cập nhật"}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Giới tính
                  </label>
                  <div className="text-gray-800 font-medium">
                    {savedData.gioiTinh || "Chưa cập nhật"}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-600 mb-1">
                    Số điện thoại
                  </label>
                  <div className="text-gray-800 font-medium">
                    {savedData.soDienThoai || "Chưa cập nhật"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
