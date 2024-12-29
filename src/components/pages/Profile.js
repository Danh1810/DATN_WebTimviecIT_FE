import React, { useState, useEffect } from "react";
import axios from "../services/axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { X } from "@mui/icons-material";

const ProfileForm = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const id = localStorage.getItem("id");
  const [formData, setFormData] = useState({
    anhDaiDien: "",
    hoVaTen: "",
    ngaySinh: "",
    thanhPho: "",
    diaChi: "",
    gioiTinh: "",
    soDienThoai: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const provinces = [
    "Hà Nội",
    "TP Hồ Chí Minh",
    "Hải Phòng",
    "Đà Nẵng",
    "Cần Thơ",
    "An Giang",
    "Bà Rịa - Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cao Bằng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Tĩnh",
    "Hải Dương",
    "Hậu Giang",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/ngtviec/detail", {
        params: { id: id },
      });

      if (response.data && Object.keys(response.data).length > 0) {
        setSavedData(response.data);
      } else {
        setSavedData(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddJobSeeker = async (e) => {
    e.preventDefault();

    if (!formData.anhDaiDien) {
      console.error("Chưa chọn ảnh đại diện!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("hoVaTen", formData.hoVaTen);
    formDataToSend.append("ngaySinh", formData.ngaySinh);
    formDataToSend.append("thanhPho", formData.thanhPho);
    formDataToSend.append("diaChi", formData.diaChi);
    formDataToSend.append("gioiTinh", formData.gioiTinh);
    formDataToSend.append("soDienThoai", formData.soDienThoai);
    formDataToSend.append("anhDaiDien", formData.anhDaiDien);
    formDataToSend.append("MaND", id);

    try {
      const response = // Update endpoint
        await axios.post("/ngtviec", formDataToSend); // Create endpoint
      setSavedData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving job seeker:", error);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log("🚀 ~ Object.entries ~ formDat:", formData.anhDaiDien);
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    console.log("🚀 ~ Object.entries ~ formDataToSend:", formDataToSend);

    try {
      await axios.put("ngtviec/update", formDataToSend);
      toast.success("Cập nhật hồ sơ thành công");
      setIsEditing(false); // Close modal after update
      fetchData();
    } catch (error) {
      console.error("Error updating CV:", error);
      toast.error("Cập nhật hồ sơ thất bại");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit1 = () => {
    setFormData(savedData);
    setPreviewImage(savedData.anhDaiDien);
    setIsEditing(true);
  };
  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

      {!savedData || isEditing ? (
        <form className="mb-6 p-4 border rounded shadow">
          <div className="mb-6 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden border mb-4">
              <img
                src={
                  previewImage ||
                  formData.anhDaiDien ||
                  "https://res.cloudinary.com/dlxczbtva/image/upload/v1735207547/webtimviecit/anh-profile-tiet-lo-g-ve-ban-1_dsmrcf.jpg"
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
              <label className="block font-medium" htmlFor="ngaySinh">
                Ngày Sinh
              </label>
              <input
                type="date"
                id="ngaySinh"
                name="ngaySinh"
                value={formData.ngaySinh}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]} // Prevents future dates
                min={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18)
                  )
                    .toISOString()
                    .split("T")[0]
                } // Ensures the user is at least 18 years old
                className="w-full border rounded px-2 py-1"
                aria-label="Ngày Sinh"
              />
            </div>

            <div>
              <label className="block font-medium">Tỉnh/Thành phố</label>
              <select
                name="thanhPho"
                value={formData.thanhPho}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
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
              <label className="block font-medium" htmlFor="soDienThoai">
                Số điện thoại
              </label>
              <input
                type="text"
                id="soDienThoai"
                name="soDienThoai"
                value={formData.soDienThoai}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
                required
                pattern="^(0[3|5|7|8|9])[0-9]{8}$" // Regex pattern for Vietnamese phone numbers
                title="Số điện thoại không hợp lệ, vui lòng nhập lại." // Title will show in browsers that support it
              />
              {formData.soDienThoai &&
                !/^(0[3|5|7|8|9])[0-9]{8}$/.test(formData.soDienThoai) && (
                  <p className="text-red-500 text-sm mt-1">
                    Số điện thoại không hợp lệ, vui lòng nhập lại.
                  </p>
                )}
            </div>
          </div>

          <button
            onClick={isEditing ? handleEdit : handleAddJobSeeker}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditing ? "Cập nhật" : "Lưu"}
          </button>
          <button
            onClick={() => {
              setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
              setPreviewImage(null);
            }}
            className="mt-4 px-4 py-2 ml-3 bg-yellow-500 text-white rounded hover:bg-blue-600"
          >
            Hủy
          </button>
        </form>
      ) : (
        <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Thông tin đã lưu</h2>
            <button
              onClick={handleEdit1}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Sửa
            </button>
          </div>
          <div className="mt-6 p-6 border rounded-lg shadow-lg bg-white">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Ảnh đại diện */}
              <div className="flex-shrink-0">
                <img
                  src={
                    savedData.anhDaiDien || "https://via.placeholder.com/150"
                  }
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
                      {new Date(savedData.ngaySinh).toLocaleDateString()}
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
        </div>
      )}
    </div>
  );
};

export default ProfileForm;
