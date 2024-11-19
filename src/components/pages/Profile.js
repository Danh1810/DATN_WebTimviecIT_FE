import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileForm = () => {
  const [profiles, setProfiles] = useState([]); // Danh sách hồ sơ
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
  });

  const [editId, setEditId] = useState(null); // ID hồ sơ đang chỉnh sửa

  // Lấy danh sách hồ sơ
  // const fetchProfiles = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/profiles");
  //     setProfiles(response.data.data);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy danh sách hồ sơ:", error);
  //   }
  // };

  // Gọi API khi load trang
  // useEffect(() => {
  //   fetchProfiles();
  // }, []);

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý gửi form
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (editId) {
  //       // Cập nhật hồ sơ
  //       await axios.put(`http://localhost:5000/profiles/${editId}`, formData);
  //       alert("Cập nhật hồ sơ thành công");
  //     } else {
  //       // Tạo mới hồ sơ
  //       await axios.post("http://localhost:5000/profiles", formData);
  //       alert("Tạo hồ sơ thành công");
  //     }
  //     fetchProfiles(); // Reload danh sách
  //     setFormData({
  //       anhDaiDien: "",
  //       hoVaTen: "",
  //       ngaySinh: "",
  //       thanhPho: "",
  //       diaChi: "",
  //       gioiTinh: "",
  //       soDienThoai: "",
  //       kyNangLapTrinh: "",
  //       capBacHienTai: "",
  //       mucTieuNgheNghiep: "",
  //     });
  //     setEditId(null); // Reset form
  //   } catch (error) {
  //     console.error("Lỗi khi gửi dữ liệu:", error);
  //   }
  // };

  // Xóa hồ sơ
  // const handleDelete = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5000/profiles/${id}`);
  //     alert("Xóa hồ sơ thành công");
  //     fetchProfiles();
  //   } catch (error) {
  //     console.error("Lỗi khi xóa hồ sơ:", error);
  //   }
  // };

  // Sửa hồ sơ
  // const handleEdit = (profile) => {
  //   setEditId(profile.id);
  //   setFormData(profile);
  // };

  return (
    <div>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-red-600 font-bold text-lg">TopDev CV</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-6">
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                TopDev CV của tôi
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Quản lý việc làm
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Quản lý CV
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Quản lý Email
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Việc đã ứng tuyển
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Việc đang theo dõi
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Trắc nghiệm tính cách
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Quản lý Hồ Sơ Cá Nhân</h1>

        <form className="mb-6 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Cập nhật hồ sơ" : "Thêm mới hồ sơ"}
          </h2>

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
          </div>

          <div className="mt-4">
            <label className="block font-medium">Mục tiêu nghề nghiệp</label>
            <textarea
              name="mucTieuNgheNghiep"
              value={formData.mucTieuNgheNghiep}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              rows="3"
            ></textarea>
          </div>

          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {editId ? "Cập nhật" : "Lưu"}
          </button>
        </form>

        {/* Danh sách hồ sơ */}
        <h2 className="text-xl font-semibold mb-4">Danh sách hồ sơ</h2>
        {/* <ul className="space-y-4">
        {profiles.map((profile) => (
          <li
            key={profile.id}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{profile.hoVaTen}</h3>
              <p>{profile.soDienThoai}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(profile)}
                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(profile.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul> */}
      </div>
    </div>
  );
};

export default ProfileForm;
