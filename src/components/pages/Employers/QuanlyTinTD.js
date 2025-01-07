import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Search } from "lucide-react";
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
import { Editor } from "@tinymce/tinymce-react";
function TTDNTD() {
  const quillRef = useRef(null);
  const [quillInstance, setQuillInstance] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [searchTerm1, setSearchTerm1] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [allJobPosts, setAllJobPosts] = useState([]);
  const postsPerPage = 5;
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
      ["Tiêu đề", "Mức lương", "Ngày hết hạn", "Trạng thái", "Nhà tuyển dụng"],
    ];
    const rows = jobPosts.map((post) => [
      post.tieude,
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
      console.log("🚀 ~ fetchJobPosts ~ response.data:", response.data);
      setAllJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  }; // Original list of job posts
  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm1(searchValue);

    if (searchValue.trim() === "") {
      // Reset to the original unfiltered list
      setJobPosts(allJobPosts);
    } else {
      // Filter based on the search term
      const filtered = allJobPosts.filter((post) =>
        post.tieude.toLowerCase().includes(searchValue.toLowerCase())
      );
      setJobPosts(filtered);
    }
    setCurrentPage1(1); // Reset to the first page
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete("/tintd", {
        params: {
          id: id,
        },
      });
      toast.success("Xóa thành công");
      fetchJobPosts(); // Tải lại danh sách
    } catch (error) {
      toast.error(`Lỗi xóa: ${error.message}`);
    }
  };
  const indexOfLastPost = currentPage1 * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = jobPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages1 = Math.ceil(jobPosts.length / postsPerPage);

  const toggleStatus = async (id) => {
    const post = jobPosts.find((post) => post.id === id);

    try {
      // Toggle status before sending
      post.trangthai = post.trangthai === "Đã duyệt" ? "Tạm dừng" : "Đã duyệt";

      const response = await axios.put("/tintd", {
        ...post,
        employer: post.employer,
        tieude: post.tieude,
      });

      if (response.data.code === 0) {
        fetchJobPosts();

        toast.success(
          post.trangthai === "Đã duyệt"
            ? "Gia hạn thành công"
            : "Đã tạm dừng bài đăng"
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
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
      console.log("🚀 ~ xemhoso ~ response.data:", response.data);
    } catch (error) {
      toast.error("Lỗi duyệt :", error);
    }
  };
  const xemhosochitiet = async (id, id1) => {
    console.log("🚀 ~ xemhoso ~ id:", id);
    try {
      const response = await axios.get("/hoso/xem", {
        params: { id: id, id1: id1 },
      });
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
      const updatedPost = { ...selectedPostcs, trangthai: "Chờ duyệt" };
      const response = await axios.put("/tintd/update", updatedPost);
      if (response.code === 0) {
        alert("Cập nhật thành công!");
        fetchJobPosts();
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
    filedinhkem: "",
  });
  useEffect(() => {
    if (currentApplicant) {
      setFormData((prevData) => ({
        ...prevData,
        idUngTuyen: currentApplicant.id,
      }));
    }
  }, [currentApplicant]);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setSelectedFile(files[0]); // Corrected this line
    }
  };
  const handleCloseModal = () => {
    setIsModalVisible1(false);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tạo FormData object
      const data = new FormData();
      data.append("idUngTuyen", formData.idUngTuyen);
      data.append("noiDung", formData.noiDung);
      if (formData.filedinhkem) {
        data.append("filedinhkem", formData.filedinhkem); // Thêm file nếu có
      }

      setIsModalVisible1(false);
      const response = await axios.post("/phanhoi", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Đảm bảo header đúng
        },
      });

      // console.log("🚀 ~ handleFormSubmit ~ response:", response);
      setFormData({
        idUngTuyen: null,
        noiDung: "",
        filedinhkem: null, // Reset filedinhkem về null
      });
      setSelectedFile(null);
      toast.success("Phản hồi thành công.");
    } catch (error) {
      console.error("Error adding feedback:", error);
      toast.error("Có lỗi xảy ra khi gửi phản hồi!");
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

  const handleEditorChange = (content) => {
    setSelectedPostcs((prev) => ({ ...prev, mota: content }));
  };
  const handleEditorChange1 = (content) => {
    setFormData((prev) => ({ ...prev, noiDung: content }));
  };

  function calculateSkillMatch(candidateSkills, jobSkills) {
    // Extract skills from jobSkills array
    const jobSkillNames = jobSkills.map((skill) => skill.ten);
    console.log("🚀 ~ calculateSkillMatch ~ jobSkillNames:", jobSkillNames);

    // Find intersection of candidate skills and job skills
    const intersection = candidateSkills.filter((skill) =>
      jobSkillNames.includes(skill)
    );
    // console.log("🚀 ~ calculateSkillMatch ~ intersection:", intersection);
    // Return match percentage
    return (intersection.length / jobSkillNames.length) * 100;
  }

  function calculateSalaryMatch(candidateSalary, jobSalary) {
    // Mức chênh lệch cho phép (10% của mức lương công việc)
    const tolerance = jobSalary * 0.1;

    if (
      candidateSalary >= jobSalary - tolerance &&
      candidateSalary <= jobSalary + tolerance
    ) {
      return 100; // Hoàn toàn phù hợp
    } else if (candidateSalary < jobSalary - tolerance) {
      return (candidateSalary / jobSalary) * 100; // Tính tỷ lệ phù hợp
    } else {
      return (jobSalary / candidateSalary) * 100;
    }
  }

  const weights = {
    skills: 0.5,
    level: 0.2,
    salary: 0.2,
    workType: 0.1,
  };
  function calculateMatchPercentage(candidate, job, weights) {
    // Default weights nếu không được cung cấp
    const defaultWeights = {
      skills: 0.5, // 50% trọng số
      level: 0.2, // 20% trọng số
      salary: 0.2, // 20% trọng số
      workType: 0.1, // 10% trọng số
    };
    weights = { ...defaultWeights, ...weights };

    let totalMatch = 0;

    // Tính độ phù hợp cho từng tiêu chí
    // 1. Kỹ năng (Skills)
    const skillsMatch =
      calculateSkillMatch(candidate.kyNangLapTrinh, job.skills) *
      weights.skills;
    totalMatch += skillsMatch;
    // console.log("🚀 ~ calculateMatchPercentage ~ skillsMatch:", skillsMatch);
    // 2. Cấp bậc (Level)
    if (candidate.capBacHienTai && Array.isArray(job.levels)) {
      // Check if the candidate's level is included in any job level description
      const levelMatch = job.levels.some(
        (level) =>
          level.ten &&
          level.ten
            .toLowerCase()
            .includes(candidate.capBacHienTai.toLowerCase())
      )
        ? 100 * weights.level
        : 0;

      totalMatch += levelMatch;

      // Log the level match for debugging
      // console.log("🚀 ~ calculateMatchPercentage ~ levelMatch:", levelMatch);
    } else {
      console.log(
        "🚨 Missing or invalid data: candidate.capBacHienTai or job.levels is undefined or not an array."
      );
    }
    // // 3. Mức lương (Salary)
    const salaryMatch =
      calculateSalaryMatch(candidate.Mucluongmongmuon, job.mucluong) *
      weights.salary;
    totalMatch += salaryMatch;
    // console.log("🚀 ~ calculateMatchPercentage ~ salaryMatch:", salaryMatch);
    // // 4. Hình thức làm việc (Work Type)
    const workTypeMatch =
      candidate.hinhThuclamviec === job.loaiHopdong
        ? 100 * weights.workType
        : 0;
    totalMatch += workTypeMatch;
    // console.log(
    //   "🚀 ~ calculateMatchPercentage ~ workTypeMatch:",
    //   workTypeMatch
    // );
    // Trả về kết quả làm tròn đến 2 chữ số thập phân
    return Math.round(totalMatch * 100) / 100;
  }

  if (selectedhoso && selectedhoso.length > 0) {
    const matchPercentage = calculateMatchPercentage(
      selectedhoso[0].UT_NTV,
      selectedhoso[0].UT_TTD,
      weights
    );
    console.log("Match Percentage:", matchPercentage);
  } else {
    console.error("selectedhoso is null, undefined, or empty.");
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [matchFilter, setMatchFilter] = useState("all");
  const itemsPerPage = 5;

  // Kiểm tra và đảm bảo selectedhoso là array
  const safeData = Array.isArray(selectedhoso) ? selectedhoso : [];

  // Lọc dữ liệu theo các điều kiện
  const filteredData = safeData.filter((app) => {
    const jobSeeker = jobSeekers.find(
      (js) => js?.id === app?.UT_NTV?.NguoitimviecId
    );
    const name = jobSeeker?.hoVaTen?.toLowerCase() || "";
    const searchMatch = name.includes(searchTerm.toLowerCase());

    // Lọc theo trạng thái
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "Chưa phản hồi" && !app?.trangthai) ||
      (statusFilter === "Đã phản hồi" && app?.trangthai);

    // Lọc theo ngày nộp
    const appDate = new Date(app?.NgayNop);
    console.log("🚀 ~ filteredData ~ appDate:", appDate);
    const today = new Date();
    const daysDiff = Math.floor((today - appDate) / (1000 * 60 * 60 * 24));
    console.log("🚀 ~ filteredData ~ daysDiff:", daysDiff);
    const dateMatch =
      dateFilter === "all" ||
      (dateFilter === "today" && daysDiff === 0) ||
      (dateFilter === "week" && daysDiff <= 7) ||
      (dateFilter === "month" && daysDiff <= 30);

    // Lọc theo tỷ lệ phù hợp
    const matchRate = calculateMatchPercentage?.(app?.UT_NTV, app?.UT_TTD) || 0;
    const matchRateMatch =
      matchFilter === "all" ||
      (matchFilter === "high" && matchRate >= 80) ||
      (matchFilter === "medium" && matchRate >= 50 && matchRate < 80) ||
      (matchFilter === "low" && matchRate < 50);

    return searchMatch && statusMatch && dateMatch && matchRateMatch;
  });

  // Reset trang khi thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, matchFilter]);

  // Tính toán số trang và dữ liệu hiện tại
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchJobPosts();
    fetchRecruiters();
    fetchJobSeekers();
    fetchSkills();
    fetchLevels();
  }, [id]);

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
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm bài đăng..."
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            value={searchTerm1}
            onChange={handleSearch}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
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
              {currentPosts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-left">{post.tieude}</td>
                  <td className="px-4 py-2 text-left">
                    {new Date(post.Ngayhethan).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-left">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        post.trangthai === "Đã duyệt"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {post.trangthai}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-left space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => xemChiTiet(post.id)}
                    >
                      Xem chi tiết
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => Chinhsua(post.id)}
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      onClick={() => xemhoso(post.id)}
                    >
                      Xem hồ sơ
                    </button>
                    {post.trangthai !== "Chờ duyệt" && (
                      <button
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        onClick={() => toggleStatus(post.id)}
                      >
                        {post.trangthai === "Đã duyệt" ? "Tạm dừng" : "Gia hạn"}
                      </button>
                    )}
                    <button
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      onClick={() => handleDelete(post.id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() => setCurrentPage1((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage1 === 1}
          >
            Trước
          </button>
          <span className="px-3 py-1">
            Trang {currentPage1} / {totalPages1}
          </span>
          <button
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
            onClick={() =>
              setCurrentPage1((prev) => Math.min(prev + 1, totalPages1))
            }
            disabled={currentPage1 === totalPages1}
          >
            Sau
          </button>
        </div>
        {selectedhoso && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl">
              <div className="p-4 sm:p-6">
                <div className="mb-4 space-y-3">
                  <div className="flex gap-4">
                    {/* Tìm kiếm */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm theo tên ứng viên..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Lọc theo trạng thái */}
                    <select
                      className="px-4 py-2 border rounded-md min-w-[160px]"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="Chưa phản hồi">Chưa phản hồi</option>
                      <option value="Đã phản hồi">Đã phản hồi</option>
                    </select>

                    {/* Lọc theo ngày nộp */}
                    <select
                      className="px-4 py-2 border rounded-md min-w-[160px]"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option value="all">Tất cả thời gian</option>
                      <option value="today">Hôm nay</option>
                      <option value="week">Tuần này</option>
                      <option value="month">Tháng này</option>
                    </select>

                    {/* Lọc theo tỷ lệ phù hợp */}
                    <select
                      className="px-4 py-2 border rounded-md min-w-[160px]"
                      value={matchFilter}
                      onChange={(e) => setMatchFilter(e.target.value)}
                    >
                      <option value="all">Tất cả tỷ lệ</option>
                      <option value="high">Phù hợp cao (≥80%)</option>
                      <option value="medium">
                        Phù hợp trung bình (50-79%)
                      </option>
                      <option value="low">Phù hợp thấp (50%)</option>
                    </select>
                  </div>

                  {/* Hiển thị thông tin lọc */}
                  <div className="text-sm text-gray-500">
                    Tìm thấy {totalItems} hồ sơ phù hợp
                  </div>
                </div>
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                        Họ Tên
                      </th>
                      <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                        Ngày Nộp
                      </th>
                      <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                        Trạng Thái
                      </th>
                      <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                        Tỷ lệ phù hợp
                      </th>
                      <th className="px-6 py-4 border-b text-left text-sm font-semibold text-gray-600">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.length > 0 ? (
                      currentData.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 border-b text-gray-800">
                            {jobSeekers.find(
                              (rec) => rec.id === app.UT_NTV.NguoitimviecId
                            )?.hoVaTen || "N/A"}
                          </td>
                          <td className="px-6 py-4 border-b text-gray-800">
                            {new Date(app.NgayNop).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 border-b">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                !app.trangthai
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {app.trangthai || "Chưa phản hồi"}
                            </span>
                          </td>
                          <td className="px-6 py-4 border-b text-gray-800">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {calculateMatchPercentage(app.UT_NTV, app.UT_TTD)}
                              %
                            </span>
                          </td>
                          <td className="px-6 py-4 border-b space-x-2">
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                              onClick={() =>
                                xemhosochitiet(app.UT_NTV.id, app.id)
                              }
                            >
                              Xem chi tiết
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                              onClick={() => console.log("Từ chối:", app.id)}
                            >
                              Từ chối
                            </button>
                            <button
                              onClick={() => handleOpenModal(app.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                            >
                              Phản hồi ứng tuyển
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-gray-500 text-center border-b"
                        >
                          Chưa có hồ sơ ứng tuyển nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {totalItems > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-600">
                      Hiển thị {Math.min(itemsPerPage, totalItems)} /{" "}
                      {totalItems} hồ sơ
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Trước
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "border hover:bg-gray-50"
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Tiếp
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end px-6 py-4 bg-gray-50 rounded-b-lg">
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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
          <div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50"
            aria-label="Job Details Modal"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 w-2/3 max-h-screen overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">{selectedPost.tieude}</h2>
              <p className="mb-4">
                <strong>Nhà tuyển dụng:</strong>{" "}
                {recruiters.find((rec) => rec.id === selectedPost.MaNTD)?.ten ||
                  "Thông tin không có sẵn"}
              </p>
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  {selectedPost?.title || "Thông tin tuyển dụng"}
                </h1>
                <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                  <div>
                    <strong>Kinh nghiệm:</strong>{" "}
                    {selectedPost?.kinhNghiem || "Thông tin không có sẵn"}
                  </div>
                  <div>
                    <strong>Cấp bậc:</strong>{" "}
                    {selectedPost?.levels?.length > 0
                      ? selectedPost.levels.map((level, index) => (
                          <span key={index}>
                            {level.ten || "N/A"}
                            {index < selectedPost.levels.length - 1 && ", "}
                          </span>
                        ))
                      : "Thông tin không có sẵn"}
                  </div>
                  <div>
                    <strong>Loại hợp đồng:</strong>{" "}
                    {selectedPost?.loaiHopdong || "Thông tin không có sẵn"}
                  </div>
                  <div>
                    <strong>Kỹ năng:</strong>{" "}
                    {selectedPost?.skills?.length > 0
                      ? selectedPost.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 p-1 rounded mr-2"
                          >
                            {skill.ten || "N/A"}
                          </span>
                        ))
                      : "Thông tin không có sẵn"}
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong>{" "}
                    {selectedPost?.diaChiLamviec || "Thông tin không có sẵn"}
                  </div>
                </div>
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Mô tả công việc
                  </h2>
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: selectedPost?.mota || "Thông tin không có sẵn.",
                    }}
                  ></p>
                </div>
              </div>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 mt-4"
                onClick={closeModal}
                type="button"
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
                    <div>
                      <Editor
                        apiKey="0quscvfjqhtejntlhe93sbs0lzvm10e4lx8eg0yogzutv8jh"
                        value={selectedPostcs.mota}
                        onEditorChange={handleEditorChange}
                        init={{
                          height: 300,
                          menubar: true,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help",
                        }}
                      />
                    </div>
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
          width={900} /* Tăng kích thước Modal */
          footer={null}
        >
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-lg">
            {/* Tiêu đề Modal */}
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              Phản hồi ứng tuyển
            </h2>

            {/* Form */}
            <form onSubmit={handleFormSubmit}>
              {/* Nội dung Editor */}
              <div className="mb-6">
                <label
                  htmlFor="noiDung"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Nội dung phản hồi
                </label>
                <Editor
                  apiKey="0quscvfjqhtejntlhe93sbs0lzvm10e4lx8eg0yogzutv8jh"
                  value={formData.noiDung}
                  onEditorChange={handleEditorChange1}
                  init={{
                    height: 400 /* Tăng chiều cao Editor */,
                    menubar: true,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | removeformat | help",
                  }}
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label
                  htmlFor="fileUpload"
                  className="block text-lg font-medium text-gray-700 mb-2"
                >
                  Tải tệp đính kèm
                </label>
                <input
                  type="file"
                  name="filedinhkem"
                  onChange={handleFileChange}
                  className="w-full text-lg text-gray-600 
            file:mr-4 file:py-3 file:px-6
            file:rounded-md file:border-0
            file:text-lg file:font-semibold
            file:bg-blue-100 file:text-blue-800
            hover:file:bg-blue-200"
                />
                {selectedFile && (
                  <p className="text-md text-gray-600 mt-2">
                    Đã chọn tệp: {selectedFile.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white text-lg py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
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
