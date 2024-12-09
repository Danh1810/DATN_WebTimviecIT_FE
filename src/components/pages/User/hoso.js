import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { toast } from "react-toastify";

const CVManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const id = localStorage.getItem("id");
  const [jobSeekers, setJobSeekers] = useState([]);
  const [hoso, sethoso] = useState([]);
  const [formData, setFormData] = useState({
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
    chungChiNgheNghiep: "",
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
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append("NguoitimviecId", selectedNTV.id);

    try {
      await axios.post("/hoso", formDataToSend);
      setIsOpen(false); // Close modal after submission
      setFormData({
        kyNangLapTrinh: "",
        capBacHienTai: "",
        mucTieuNgheNghiep: "",
        chungChiNgheNghiep: "",
        duAnDaThamGia: "",
        fileHoso: "",
        trinhDoHocVan: "",
        kinhNghiemLamViec: "",
        tenhoso: "",
      });
      toast.success("Tạo hồ sơ thành công");
      fetchhoso(); // Reload the CV list
    } catch (error) {
      console.error("Error adding CV:", error);
      toast.error("Tạo hồ sơ thất bại");
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
      chungChiNgheNghiep: "",
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
                  Bạn chưa có CV
                </td>
              </tr>
            ) : (
              hoso.map((hs) => (
                <tr className="text-gray-800" key={hs.id}>
                  <td className="border-t px-6 py-3">{hs.tenhoso}</td>
                  <td className="border-t px-6 py-3">{hs.trangthai}</td>
                  <td className="border-t px-6 py-3">{hs.ngayCapNhat}</td>
                  <td className="border-t px-6 py-3 flex space-x-3">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => xemChiTiet(hs.id)}
                    >
                      chỉnh sửa
                    </button>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => xemChiTiet1(hs.id)}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => Xoahoso(hs.id)}
                    >
                      Xóa
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
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-20 h-20 mt-2"
                  />
                )}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="container mx-auto p-4 bg-white max-h-[90vh] overflow-y-auto">
            <form className="mb-6 p-4 border rounded shadow">
              <h2 className="text-xl font-semibold mb-4">
                {selectedhosoNTV.tenhoso}
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
                    {(() => {
                      const ngaySinh = jobSeekers.find(
                        (rec) => rec.id === selectedhosoNTV.NguoitimviecId
                      )?.ngaySinh;

                      // Kiểm tra nếu ngaySinh có giá trị hợp lệ
                      return ngaySinh
                        ? new Date(ngaySinh).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "N/A"; // Trả về "N/A" nếu không có ngày sinh
                    })()}
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
                    Kinh nghiệm làm việc
                  </label>
                  <label className="block">
                    {selectedhosoNTV.kinhNghiemLamViec || "Chưa nhập"}
                  </label>
                </div>
                <div>
                  <label className="block font-medium">Trình độ học vấn</label>
                  <label className="block">
                    {selectedhosoNTV.trinhDoHocVan || "Chưa nhập"}
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
                    {selectedhosoNTV.fileHoso ? "Có" : "Không"}
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
