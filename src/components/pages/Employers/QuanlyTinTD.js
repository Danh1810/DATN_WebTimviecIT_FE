import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import Select from "react-select";
import "jspdf-autotable";
import "../../slice/Roboto-Regular-normal.js";
import { toast } from "react-toastify";
import { Modal, Button } from "antd";
import Quill from "quill";
import "react-toastify/dist/ReactToastify.css";
import "quill/dist/quill.snow.css";
function TTDNTD() {
  const quillRef = useRef(null);
  const [quillInstance, setQuillInstance] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedPostcs, setSelectedPostcs] = useState(null);
  const [selectedhoso, setSelectedhosot] = useState(null);
  const [selectedhosoxem, setSelectedhosoxem] = useState(null);
  const xemChiTiet = (id) => {
    const post = jobPosts.find((post) => post.id === id);
    setSelectedPost(post); // Lưu bài đăng được chọn vào state
  };

  const xemhoso = async (id) => {
    console.log("🚀 ~ xemhoso ~ id:", id);
    try {
      const response = await axios.get("/Ut/hosout", { params: { id: id } });
      setSelectedhosot(response.data);
    } catch (error) {
      toast.error("Lỗi duyệt :", error);
    }
  };
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
      if (response.code === 0) {
        alert("Cập nhật thành công!");
        setSelectedPostcs(null);
      } else {
        alert("Đã xảy ra lỗi khi cập nhật.");
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };
  const [currentApplicant, setCurrentApplicant] = useState(null);
  const handleOpenModal = (id) => {
    const post = selectedhoso.find((post) => post.id === id);
    setCurrentApplicant(post);
    setIsModalVisible1(true);
  };
  const [formData, setFormData] = useState({
    idUngTuyen: null,
    noiDung: "",
  });
  useEffect(() => {
    if (currentApplicant) {
      setFormData((prevData) => ({
        ...prevData,
        idUngTuyen: currentApplicant.id,
      }));
    }
  }, [currentApplicant]);

  const handleChangeut = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCloseModal = () => {
    setIsModalVisible1(false);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/phanhoi", formData);
      console.log("🚀 ~ handleFormSubmit ~ formData:", formData);
      console.log("🚀 ~ handleFormSubmit ~ response:", response);
      toast.success("Đăng thành công hãy chờ quản trị viên duyệt");
    } catch (error) {
      console.error("Error adding job post:", error);
    }
  };
  const Chinhsua = (id) => {
    const post = jobPosts.find((post) => {
      return post.id === id;
    });
    console.log("🚀 ~ Chinhsua ~ post:", post);
    setSelectedPostcs(post);
    // Lưu bài đăng được chọn vào state
  };

  useEffect(() => {
    if (!quillRef.current || !selectedPostcs) return; // Đảm bảo ref và dữ liệu hợp lệ
    if (!quillInstance) {
      // Khởi tạo Quill
      const newQuillInstance = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
          ],
        },
      });
      console.log("🚀 ~ TTDNTD ~ selectedPostcs:", selectedPostcs);
      setQuillInstance(newQuillInstance);

      // Lắng nghe sự kiện text-change
      newQuillInstance.on("text-change", () => {
        const content = newQuillInstance.root.innerHTML;
        setSelectedPostcs((prev) => ({
          ...prev,
          mota: content,
        }));
      });
    }

    // Cập nhật nội dung nếu có `mota`
    if (selectedPostcs.mota && quillInstance) {
      quillInstance.root.innerHTML = selectedPostcs.mota;
      console.log(
        "🚀 ~ useEffect ~ quillInstance.root.innerHTM:",
        quillInstance.root.innerHTM
      );
    }

    // Cleanup khi component unmount
    return () => {
      if (quillInstance) {
        quillInstance.off("text-change");
        quillInstance.root.innerHTML = "";
        setQuillInstance(null);
      }
    };
  }, [selectedPostcs]); // Loại bỏ quillInstance khỏi dependency array

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
                        <button
                          onClick={() => handleOpenModal(app.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Phản hồi ứng tuyển
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedhosoxem.tenhoso}
                </h2>
                <button
                  onClick={closeModal2}
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
                          (rec) => rec.id === selectedhosoxem.NguoitimviecId
                        )?.anhDaiDien || "N/A"
                      }
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {jobSeekers.find(
                        (rec) => rec.id === selectedhosoxem.NguoitimviecId
                      )?.hoVaTen || "N/A"}
                    </h3>
                    <p className="text-gray-600">
                      {selectedhosoxem.capBacHienTai || "Chưa xác định"}
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
                          {jobSeekers.find(
                            (rec) => rec.id === selectedhosoxem.NguoitimviecId
                          )?.ngaySinh || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Giới Tính:
                        </label>
                        <p className="text-gray-900">
                          {jobSeekers.find(
                            (rec) => rec.id === selectedhosoxem.NguoitimviecId
                          )?.gioiTinh || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Địa chỉ:
                        </label>
                        <p className="text-gray-900">
                          {jobSeekers.find(
                            (rec) => rec.id === selectedhosoxem.NguoitimviecId
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
                            (rec) => rec.id === selectedhosoxem.NguoitimviecId
                          )?.soDienThoai || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Tỉnh/Thành phố:
                        </label>
                        <p className="text-gray-900">
                          {jobSeekers.find(
                            (rec) => rec.id === selectedhosoxem.NguoitimviecId
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
                          {selectedhosoxem.kyNangLapTrinh || "Chưa nhập"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Projects and Goals */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                      Dự Án & Mục Tiêu
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Dự án đã tham gia:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoxem.duAnDaThamGia || "Chưa nhập"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Mục tiêu nghề nghiệp:
                        </label>
                        <p className="text-gray-900">
                          {selectedhosoxem.mucTieuNgheNghiep || "Chưa nhập"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Attachment */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                    Tài Liệu Đính Kèm
                  </h4>
                  {selectedhosoxem.fileHoso ? (
                    <div>
                      <Button
                        type="link"
                        onClick={showModal}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Xem hồ sơ chi tiết
                      </Button>
                      <Modal
                        title="Chi Tiết Hồ Sơ"
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width="90vw"
                        bodyStyle={{ height: "90vh", padding: 0 }}
                      >
                        <iframe
                          src={`${selectedhosoxem.fileHoso}#view=FitH`}
                          style={{ width: "100%", height: "100%" }}
                          title="Hồ sơ PDF"
                          frameBorder="0"
                        />
                      </Modal>
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có tài liệu đính kèm</p>
                  )}
                </div>
              </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="container mx-auto p-4 bg-white max-h-[90vh] overflow-y-auto">
              <form
                className="bg-white p-6 rounded-lg shadow-md"
                onSubmit={(e) => {
                  e.preventDefault(); // Ngăn form refresh trang
                  handleSua(); // Thực hiện logic sửa
                }}
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="tieude"
                      className="block font-semibold mb-1"
                    >
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
                    <label
                      htmlFor="mucluong"
                      className="block font-semibold mb-1"
                    >
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
                  <div>
                    <label htmlFor="mota" className="block font-semibold mb-1">
                      Mô tả
                    </label>
                    <div
                      ref={quillRef}
                      value={selectedPostcs.mota}
                      className="w-full border rounded"
                      style={{
                        minHeight: "150px",
                        maxHeight: "300px",
                        overflowY: "auto",
                        padding: "10px",
                      }}
                    ></div>
                  </div>
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
            </div>
          </div>
        )}
        <Modal
          title="Phản hồi ứng tuyển"
          visible={isModalVisible1}
          onCancel={handleCloseModal}
          footer={null}
        >
          <div className="max-w-md mx-auto bg-white p-6 rounded-md shadow-md mt-10">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Phản hồi ứng tuyển
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="noiDung"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nội dung phản hồi
                </label>
                <textarea
                  id="noiDung"
                  name="noiDung"
                  value={formData.noiDung}
                  onChange={handleChangeut}
                  rows="4"
                  className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập nội dung phản hồi"
                  required
                />
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Gửi Phản Hồi
              </button>
            </form>
          </div>
        </Modal>
      </>
    </div>
  );
}

export default TTDNTD;
