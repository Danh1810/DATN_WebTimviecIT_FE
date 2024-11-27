import React, { useState, useEffect } from "react";
import axios from "../../services/axios";

const CVManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const id = localStorage.getItem("id");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [isXem, setisxem] = useState(false);
  const [hoso, sethoso] = useState([]);
  const [editId, setEditId] = useState(null);
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
  const [selectedNTV, setSelectedNTV] = useState(null);
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
      const response = await axios.get("/ngtviec/hoso", { params: { id: id } });
      const hoso = response.data[0]?.hoso || []; // Safely access the nested `hoso` array
      sethoso(hoso);
    } catch (error) {
      console.error("Error fetching CV data:", error);
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const togglexemModal = () => {
    setisxem(!isOpen);
  };
  // const handleEdit = (id) => {
  //   const selectedCV = hoso.find((cv) => cv.id === id);
  //   setFormData(selectedCV);
  //   setEditId(id);
  //   toggleModal();
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const [selectedhosoNTV, setSelectedhoNTV] = useState(null);
  const xemChiTiet = (id) => {
    setisxem(!isOpen);
    const post = hoso.find((post) => post.id === id);
    setSelectedhoNTV(post); // Lưu bài đăng được chọn vào state
  };
  const closeModal = () => {
    setSelectedhoNTV(null); // Đóng modal
  };

  useEffect(() => {
    fetchhoso();
    fetchJobSeekers();
  }, []);

  return (
    <div className="container mx-auto p-4  min-h-screen">
      <button
        onClick={toggleModal}
        className="bg-gray-700 text-white px-4 py-2 rounded flex items-center space-x-2"
      >
        <span>Tải hồ sơ</span>
      </button>
      <div className="bg-gray-100 p-4 rounded">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="text-gray-600 font-medium">
              <th className="px-4 py-2">Tên CV</th>
              <th className="px-4 py-2">Trạng thái CV</th>
              <th className="px-4 py-2">Lần chỉnh sửa cuối</th>
              <th className="px-4 py-2">Tùy chọn</th>
            </tr>
          </thead>
          <tbody>
            {hoso.length === 0 ? (
              <tr>
                <td className="px-4 py-2 text-center" colSpan="4">
                  No CVs found.
                </td>
              </tr>
            ) : (
              hoso.map((hs) => (
                <tr className="text-gray-800" key={hs.id}>
                  <td className="border-t px-6 py-3">{hs.tenhoso}</td>
                  <td className="border-t px-6 py-3">{hs.mucTieuNgheNghiep}</td>
                  <td className="border-t px-6 py-3">{hs.ngayCapNhat}</td>
                  <td className="border-t px-6 py-3 flex space-x-3">
                    <button
                      className="text-blue-500 hover:underline"
                      // onClick={() => handleEdit(hs.id)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => xemChiTiet(hs.id)}
                    >
                      Xem
                    </button>
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
                {/* <div>
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
                </div> */}

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
          </div>
        </div>
      )}
      {selectedhosoNTV && (
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
                      jobSeekers.find(
                        (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                      )?.anhDaiDien || "N/A"
                    }
                    // selectedhosoNTV.anhDaiDien ||
                    // "https://res.cloudinary.com/dlxczbtva/image/upload/v1704720124/oneweedshop/vcgfoxlfcoipwxywcimv.jpg"
                    // Ảnh mặc định nếu không có ảnh
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="text-sm">
                  {jobSeekers.find(
                    (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                  )?.anhDaiDien
                    ? "Ảnh đã tải lên"
                    : "Chưa tải ảnh"}
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium">Họ và Tên:</label>
                  <label className="block">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                    )?.hoVaTen || "N/A"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">Ngày Sinh:</label>
                  <label className="block">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                    )?.ngaySinh || "N/A"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">Tỉnh/Thành phố:</label>
                  <label className="block">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                    )?.thanhPho || "N/A"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">Địa chỉ:</label>
                  <label className="block">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                    )?.diaChi || "N/A"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">Giới Tính:</label>
                  <label className="block">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                    )?.gioiTinh || "N/A"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">Số điện thoại:</label>
                  <label className="block">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                    )?.soDienThoai || "N/A"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">
                    Kỹ năng lập trình:
                  </label>
                  <label className="block">
                    {selectedhosoNTV.kyNangLapTrinh || "Chưa nhập"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">Cấp bậc hiện tại:</label>
                  <label className="block">
                    {selectedhosoNTV.capBacHienTai || "Chưa nhập"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">
                    Chứng chỉ nghề nghiệp:
                  </label>
                  <label className="block">
                    {selectedhosoNTV.chungChiNgheNghiep || "Chưa nhập"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">
                    Dự án đã tham gia:
                  </label>
                  <label className="block">
                    {selectedhosoNTV.duAnDaThamGia || "Chưa nhập"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">
                    Link hồ sơ online:
                  </label>
                  <label className="block">
                    {selectedhosoNTV.selectedhosoNTV || "Chưa nhập"}
                  </label>
                </div>

                <div>
                  <label className="block font-medium">Ngày cập nhật:</label>
                  <label className="block">
                    {selectedhosoNTV.ngayCapNhat || "Chưa nhập"}
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <label className="block font-medium">
                  Mục tiêu nghề nghiệp:
                </label>
                <label className="block">
                  {selectedhosoNTV.mucTieuNgheNghiep || "Chưa nhập"}
                </label>
              </div>

              <button
                onClick={closeModal}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
              >
                Đóng
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVManagement;
