import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import Select from "react-select";
import "jspdf-autotable";
import "../../slice/Roboto-Regular-normal.js";
import { toast } from "react-toastify";

function TTDNTD() {
  const id = localStorage.getItem("id");
  const [jobPost, setJobPost] = useState({
    tieude: "",
    mota: "",
    mucluong: "",
    trangthai: "Chờ duyệt",
    kinhNghiem: "",
    loaiHopdong: "",
    diaChiLamviec: "",
    Kynang: [],
    Capbac: [],
  });
  const [jobSeekers, setJobSeekers] = useState([]);
  const [jobPosts, setJobPosts] = useState([]);
  const [recruiters, setRecruiters] = useState([]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    // doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    // doc.setFont("Roboto");
    doc.setFont("Roboto-Regular");

    doc.setFontSize(18);
    doc.text("Tin tuyển dụng", 14, 20);
    doc.setFontSize(12);

    const headers = [
      [
        "Tiêu đề",
        "Mô tả ",
        "Mức lương",
        "Ngày hết hạn",
        "Trạng thái",
        "Nhà tuyển dụng",
      ],
    ];
    const rows = jobPosts.map((post) => [
      post.tieude,
      post.mota,
      post.mucluong,
      new Date(post.Ngayhethan).toLocaleDateString(),
      post.trangthai,
      recruiters.find((rec) => rec.id === post.MaNTD)?.ten || "N/A",
    ]);

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: "striped",
      styles: {
        font: "Roboto-Regular",
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133], // Màu nền tiêu đề bảng
        textColor: 255,
        fontSize: 11,
        fontStyle: "bold",
      },
    });

    doc.save("job_posts_list.pdf");
  };

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd/ntd", { params: { id: id } });
      console.log("🚀 ~ fetchJobPosts ~ response:", response);
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };
  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get("/nhatd");
      setRecruiters(response.data);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    }
  };
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setSelectedPostcs({
      ...selectedPostcs, // Sao chép các trường hiện tại
      [name]: value, // Cập nhật trường đang thay đổi
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobPost((prev) => ({ ...prev, [name]: value }));
  };

  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostcs, setSelectedPostcs] = useState(null);
  const [selectedhoso, setSelectedhosot] = useState(null);
  const [selectedhosoxem, setSelectedhosoxem] = useState(null);
  const xemChiTiet = (id) => {
    const post = jobPosts.find((post) => post.id === id);
    setSelectedPost(post); // Lưu bài đăng được chọn vào state
  };
  const Chinhsua = (id) => {
    const post = jobPosts.find((post) => post.id === id);
    setSelectedPostcs(post); // Lưu bài đăng được chọn vào state
  };
  const xemhoso = async (id) => {
    console.log("🚀 ~ xemhoso ~ id:", id);
    try {
      const response = await axios.get("/Ut/hosout", { params: { id: id } });
      console.log("🚀 ~ xemhoso ~ response:", response.data);
      setSelectedhosot(response.data);
    } catch (error) {
      toast.error("Lỗi duyệt :", error);
    }
  };
  console.log("🚀 ~ TTDNTD ~ selectedhoso:", selectedhoso);
  const xemhosochitiet = async (id) => {
    console.log("🚀 ~ xemhoso ~ id:", id);
    try {
      const response = await axios.get("/hoso/xem", { params: { id: id } });
      setSelectedhosoxem(response.data);
    } catch (error) {
      toast.error("Lỗi duyệt :", error);
    }
  };
  const [skills, setSkills] = useState([]); // Quản lý danh sách kỹ năng
  const [levels, setLevels] = useState([]); // Quản lý danh sách cấp bậc
  const fetchSkills = async () => {
    try {
      const response = await axios.get("/kynang");
      const formattedSkills = response.data.map((skill) => ({
        value: skill.id,
        label: skill.ten,
      }));
      setSkills(formattedSkills);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  // Fetch danh sách cấp bậc
  const fetchLevels = async () => {
    try {
      const response = await axios.get("/capbac");
      const formattedLevels = response.data.map((level) => ({
        value: level.id,
        label: level.ten,
      }));
      setLevels(formattedLevels);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };
  // const handleShowFile = (fileHoso) => {
  //   setSelectedFile(fileHoso); // Lưu file hồ sơ được chọn
  //   setShowModal(true); // Mở modal
  // };

  // // Xử lý đóng modal
  // const handleCloseModal = () => {
  //   setShowModal(false); // Đóng modal
  //   setSelectedFile(null); // Xoá file đã chọn
  // };
  const handleMultiSelectChange = (selectedOptions, { name }) => {
    setJobPost((prev) => ({ ...prev, [name]: selectedOptions }));
  };

  const closeModal = () => {
    setSelectedPost(null); // Đóng modal
  };
  const closeModal1 = () => {
    setSelectedhosot(null); // Đóng modal
  };
  const closeModal2 = () => {
    setSelectedhosoxem(null); // Đóng modal
  };
  const handleHuy = () => {
    setSelectedPostcs(null); // Đóng modal
  };
  const handleSua = async () => {
    try {
      const response = await axios.put("/tintd/update", selectedPostcs);
      console.log("🚀 ~ handleSua ~ response:", response);
      if (response.code === 0) {
        alert("Cập nhật thành công!");
      } else {
        alert("Đã xảy ra lỗi khi cập nhật.");
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  useEffect(() => {
    fetchJobPosts();
    fetchRecruiters();
    fetchJobSeekers();
    fetchSkills();
    fetchLevels();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý tin tuyển dụng
      </h1>

      <div className="text-right mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      <>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg mt-6 shadow-md">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 sticky top-0 bg-white z-10 text-left">
                  Tên bài đăng
                </th>
                <th className="px-4 py-2 sticky top-0 bg-white z-10 text-left">
                  Mô tả
                </th>
                <th className="px-4 py-2 sticky top-0 bg-white z-10 text-left">
                  Ngày Hết hạn
                </th>
                <th className="px-4 py-2 sticky top-0 bg-white z-10 text-left">
                  Trạng thái
                </th>
                <th className="px-4 py-2 sticky top-0 bg-white z-10 text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {jobPosts.map((post) => (
                <tr key={post.id} className="border-b">
                  <td className="px-4 py-2 text-left">{post.tieude}</td>
                  <td className="px-4 py-2 text-left">{post.mota}</td>
                  <td className="px-4 py-2 text-left">
                    {new Date(post.Ngayhethan).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-left">{post.trangthai}</td>
                  <td className="px-4 py-2 text-left">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => xemChiTiet(post.id)}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => Chinhsua(post.id)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => xemhoso(post.id)}
                    >
                      Xem hồ sơ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedhoso && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-3 border border-gray-300 text-left bg-gray-100 text-gray-700 font-semibold">
                      Họ Tên
                    </th>
                    <th className="px-4 py-3 border border-gray-300 text-left bg-gray-100 text-gray-700 font-semibold">
                      Ngày Nộp
                    </th>
                    <th className="px-4 py-3 border border-gray-300 text-left bg-gray-100 text-gray-700 font-semibold">
                      Trạng Thái
                    </th>
                    <th className="px-4 py-3 border border-gray-300 text-left bg-gray-100 text-gray-700 font-semibold">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedhoso.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 border border-gray-300 text-gray-800 text-center">
                        {jobSeekers.find(
                          (rec) => rec.id === app.UT_NTV.NguoitimviecId
                        )?.hoVaTen || "N/A"}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 text-gray-800 text-center">
                        {new Date(app.NgayNop).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 border border-gray-300 text-gray-800 text-center">
                        {app.trangthai}
                      </td>
                      <td className="px-4 py-2 sticky left-0 bg-white">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          onClick={() => xemhosochitiet(app.UT_NTV.id)}
                        >
                          Xem chi tiết
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded"
                          onClick={() => console.log("Từ chối:", app.id)}
                        >
                          Từ chối
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end p-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
                  onClick={closeModal1}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
        {selectedhosoxem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="container mx-auto p-4 bg-white max-h-[90vh] overflow-y-auto">
              <form className="mb-6 p-4 border rounded shadow">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedhosoxem.tenhoso}
                </h2>

                <div className="mb-6 flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border mb-4">
                    <img
                      src={
                        jobSeekers.find(
                          (rec) => rec.id === selectedhosoxem.NguoitimviecId
                        )?.anhDaiDien || "N/A"
                      }
                      // selectedhosoxem.anhDaiDien ||
                      // "https://res.cloudinary.com/dlxczbtva/image/upload/v1704720124/oneweedshop/vcgfoxlfcoipwxywcimv.jpg"
                      // Ảnh mặc định nếu không có ảnh
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="text-sm">
                    {jobSeekers.find(
                      (rec) => rec.id === selectedhosoxem.NguoitimviecId
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
                        (rec) => rec.id === selectedhosoxem.NguoitimviecId
                      )?.hoVaTen || "N/A"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">Ngày Sinh:</label>
                    <label className="block">
                      {jobSeekers.find(
                        (rec) => rec.id === selectedhosoxem.NguoitimviecId
                      )?.ngaySinh || "N/A"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">Tỉnh/Thành phố:</label>
                    <label className="block">
                      {jobSeekers.find(
                        (rec) => rec.id === selectedhosoxem.NguoitimviecId
                      )?.thanhPho || "N/A"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">Địa chỉ:</label>
                    <label className="block">
                      {jobSeekers.find(
                        (rec) => rec.id === selectedhosoxem.NguoitimviecId
                      )?.diaChi || "N/A"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">Giới Tính:</label>
                    <label className="block">
                      {jobSeekers.find(
                        (rec) => rec.id === selectedhosoxem.NguoitimviecId
                      )?.gioiTinh || "N/A"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">Số điện thoại:</label>
                    <label className="block">
                      {jobSeekers.find(
                        (rec) => rec.id === selectedhosoxem.NguoitimviecId
                      )?.soDienThoai || "N/A"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">
                      Kỹ năng lập trình:
                    </label>
                    <label className="block">
                      {selectedhosoxem.kyNangLapTrinh || "Chưa nhập"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">
                      Cấp bậc hiện tại:
                    </label>
                    <label className="block">
                      {selectedhosoxem.capBacHienTai || "Chưa nhập"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">
                      Chứng chỉ nghề nghiệp:
                    </label>
                    <label className="block">
                      {selectedhosoxem.chungChiNgheNghiep || "Chưa nhập"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">
                      Dự án đã tham gia:
                    </label>
                    <label className="block">
                      {selectedhosoxem.duAnDaThamGia || "Chưa nhập"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">
                      Link hồ sơ online:
                    </label>
                    <label className="block">
                      {selectedhosoxem.selectedhosoxem || "Chưa nhập"}
                    </label>
                  </div>

                  <div>
                    <label className="block font-medium">Ngày cập nhật:</label>
                    <label className="block">
                      {selectedhosoxem.ngayCapNhat || "Chưa nhập"}
                    </label>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block font-medium">
                    Mục tiêu nghề nghiệp:
                  </label>
                  <label className="block">
                    {selectedhosoxem.mucTieuNgheNghiep || "Chưa nhập"}
                  </label>
                </div>

                <button
                  onClick={closeModal2}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                >
                  Đóng
                </button>
              </form>
            </div>
          </div>
        )}
        {selectedPost && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <h2 className="text-xl font-bold mb-4">{selectedPost.tieude}</h2>
              <p className="mb-4">
                <strong>Nhà tuyển dụng:</strong>{" "}
                {recruiters.find((rec) => rec.id === selectedPost.MaNTD)?.ten ||
                  "N/A"}
              </p>
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  {selectedPost?.title || "Thông tin tuyển dụng"}
                </h1>
                <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                  <div>
                    <strong>Kinh nghiệm</strong>{" "}
                    {selectedPost?.kinhNghiem || "N/A"}
                  </div>
                  <div>
                    <strong>Cấp bậc : </strong>
                    {selectedPost?.levels?.length > 0
                      ? selectedPost.levels.map((level, index) => (
                          <span key={index}>
                            {level.ten || "N/A"}
                            {index < selectedPost.levels.length - 1 &&
                              ", "}{" "}
                            {/* Thêm dấu phẩy nếu không phải phần tử cuối */}
                          </span>
                        ))
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Loại hợp đồng : </strong>{" "}
                    {selectedPost?.loaiHopdong || "N/A"}
                  </div>
                  <div>
                    <strong>Kỹ năng : </strong>
                    {selectedPost?.skills?.length > 0
                      ? selectedPost.skills.map((skill, index) => (
                          <span key={index}>
                            {skill.ten || "N/A"}
                            {index < selectedPost.skills.length - 1 &&
                              ", "}{" "}
                            {/* Thêm dấu phẩy nếu không phải phần tử cuối */}
                          </span>
                        ))
                      : "N/A"}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedPost?.diaChiLamviec || "N/A"}
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Mô tả công việc
                  </h2>
                  <p className="text-gray-700">
                    {selectedPost?.mota || "Thông tin không có sẵn."}
                  </p>
                </div>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={closeModal}
              >
                Đóng
              </button>
            </div>
          </div>
        )}
        {selectedPostcs && (
          <form
            className="bg-white p-6 rounded-lg shadow-md"
            onSubmit={(e) => {
              e.preventDefault(); // Ngăn form refresh trang
              handleSua(); // Thực hiện logic sửa
            }}
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="tieude" className="block font-semibold mb-1">
                  Tiêu đề
                </label>
                <input
                  id="tieude"
                  type="text"
                  name="tieude"
                  value={selectedPostcs.tieude}
                  onChange={handleChange1}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề"
                  required
                />
              </div>
              <div>
                <label htmlFor="mota" className="block font-semibold mb-1">
                  Mô tả
                </label>
                <textarea
                  id="mota"
                  name="mota"
                  value={selectedPostcs.mota}
                  onChange={handleChange1}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mô tả công việc"
                  required
                />
              </div>
              <div>
                <label htmlFor="mucluong" className="block font-semibold mb-1">
                  Mức lương
                </label>
                <input
                  id="mucluong"
                  type="text"
                  name="mucluong"
                  value={selectedPostcs.mucluong}
                  onChange={handleChange1}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mức lương"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="kinhNghiem"
                  className="block font-semibold mb-1"
                >
                  Kinh nghiệm
                </label>
                <input
                  id="kinhNghiem"
                  type="text"
                  name="kinhNghiem"
                  value={selectedPostcs.kinhNghiem}
                  onChange={handleChange1}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập kinh nghiệm (VD: 3-5 năm)"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="diaChiLamviec"
                  className="block font-semibold mb-1"
                >
                  Địa chỉ làm việc
                </label>
                <input
                  id="diaChiLamviec"
                  type="text"
                  name="diaChiLamviec"
                  value={selectedPostcs.diaChiLamviec}
                  onChange={handleChange1}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ làm việc"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="loaiHopdong"
                  className="block font-semibold mb-1"
                >
                  Loại hợp đồng
                </label>
                <select
                  id="loaiHopdong"
                  name="loaiHopdong"
                  value={selectedPostcs.loaiHopdong}
                  onChange={handleChange1}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn loại hợp đồng</option>
                  <option value="Toàn thời gian">Toàn thời gian</option>
                  <option value="Bán thời gian">Bán thời gian</option>
                  <option value="Hợp đồng thời vụ">Hợp đồng thời vụ</option>
                </select>
              </div>
              {/* <div>
                <label htmlFor="Kynang" className="block font-semibold mb-1">
                  Kỹ năng
                </label>
                <Select
                  id="Kynang"
                  name="Kynang"
                  isMulti
                  options={skills}
                  value={selectedPostcs.Kynang}
                  onChange={handleMultiSelectChange}
                  placeholder="Chọn kỹ năng"
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="Capbac" className="block font-semibold mb-1">
                  Cấp bậc
                </label>
                <Select
                  id="Capbac"
                  name="Capbac"
                  isMulti
                  options={levels}
                  value={selectedPostcs.Capbac}
                  onChange={handleMultiSelectChange}
                  placeholder="Chọn cấp bậc"
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div> */}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={handleHuy}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 focus:ring-2 focus:ring-gray-500"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </>
    </div>
  );
}

export default TTDNTD;
