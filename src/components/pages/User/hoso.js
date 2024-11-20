import React, { useState } from "react";

const CVManagement = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
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
    <div className="container mx-auto p-4">
      {/* Navigation */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <div className="flex space-x-4">
          <a href="#" className="text-red-600 font-medium">
            Quản lý CV
          </a>
          <span className="text-gray-400">|</span>
          <a href="#" className="text-gray-600">
            Thư giới thiệu
          </a>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleModal}
            className="bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4-4m0 0l4-4m-4 4v12"
              />
            </svg>
            <span>Tải CV lên</span>
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-3 3v6m-6-6a3 3 0 003 3h6a3 3 0 003-3V9a3 3 0 00-3-3H9a3 3 0 00-3 3v6z"
              />
            </svg>
            <span>Tạo CV mới</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-100 p-4 rounded">
        <div className="grid grid-cols-4 text-gray-600 font-medium">
          <div>Tên CV</div>
          <div>Trạng thái CV</div>
          <div>Lần chỉnh sửa cuối</div>
          <div>Tùy chọn</div>
        </div>
        {/* Table content */}
        <div className="grid grid-cols-4 text-gray-800 mt-2">
          <div>CV Mẫu</div>
          <div>Hoạt động</div>
          <div>18/11/2024</div>
          <div>
            <button className="text-blue-500 hover:underline">Chỉnh sửa</button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="container mx-auto p-4 bg-white max-h-[90vh] overflow-y-auto">
            <form className="mb-6 p-4 border rounded shadow">
              <h2 className="text-xl font-semibold mb-4">
                {editId ? "Cập nhật hồ sơ" : "Thêm mới hồ sơ"}
              </h2>

              <div className="mb-6 flex flex-col items-center">
                <div className="w-48 h-48 rounded-full overflow-hidden border mb-4">
                  <img
                    src={
                      formData.anhDaiDien ||
                      "https://res.cloudinary.com/dlxczbtva/image/upload/v1704720124/oneweedshop/vcgfoxlfcoipwxywcimv.jpg"
                    } // Ảnh mặc định nếu không có ảnh
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  // onChange={handleFileUpload} // Xử lý upload ảnh
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
                  <label className="block font-medium">
                    Chứng chỉ nghề nghiệp
                  </label>
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
                <label className="block font-medium">
                  Mục tiêu nghề nghiệp
                </label>
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
              <button
                onClick={toggleModal}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
            </form>

            <h2 className="text-xl font-semibold mb-4">Danh sách hồ sơ</h2>
            {/* Danh sách hồ sơ rendering */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManagement;
