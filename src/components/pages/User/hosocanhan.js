import React, { useState, useEffect } from "react";
import axios from "axios";

const Hosocanhan = () => {
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
    chungChiNgheNghiep: "",
    duAnDaThamGia: "",
    linkHoSoOnline: "",
    ngayCapNhat: "",
  });

  const [editId, setEditId] = useState(null); // ID hồ sơ đang chỉnh sửa

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
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

            <div>
              <label className="block font-medium">Chứng chỉ nghề nghiệp</label>
              <input
                type="text"
                name="chungChiNgheNghiep"
                value={formData.chungChiNgheNghiep}
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
                rows="2"
              ></textarea>
            </div>

            <div>
              <label className="block font-medium">Link hồ sơ online</label>
              <input
                type="url"
                name="linkHoSoOnline"
                value={formData.linkHoSoOnline}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium">Ngày cập nhật</label>
              <input
                type="date"
                name="ngayCapNhat"
                value={formData.ngayCapNhat}
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

        <h2 className="text-xl font-semibold mb-4">Danh sách hồ sơ</h2>
        {/* Danh sách hồ sơ rendering */}
      </div>
    </div>
  );
};

export default Hosocanhan;
