import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function JobSeekerManagement() {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [users, setUsers] = useState([]);
  const [newJobSeeker, setNewJobSeeker] = useState({
    email: "",
    ten: "",
    SDT: "",
    image: "",
    MaND: "",
    gioitinh: 1, // Default to Male (e.g., 1 = Male, 2 = Female)
    fileCV: "",
    Soluongnophoso: 0,
  });

  // Export job seeker data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Set title and metadata
    doc.setFontSize(18);
    doc.text("Job Seekers List", 14, 20);
    doc.setFontSize(12);

    // Prepare headers and data for the table
    const headers = [
      ["Email", "Name", "Phone", "Gender", "CV File", "Applications"],
    ];
    const rows = jobSeekers.map((jobSeeker) => [
      jobSeeker.email,
      jobSeeker.ten,
      jobSeeker.SDT,
      jobSeeker.gioitinh === 1 ? "Male" : "Female",
      jobSeeker.fileCV,
      jobSeeker.Soluongnophoso,
    ]);

    // Add table to PDF
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

    // Save the PDF
    doc.save("job_seekers_list.pdf");
  };

  // Fetch job seekers from the backend
  const fetchJobSeekers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setJobSeekers(response.data);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
    }
  };

  // Fetch users for the dropdown list
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/nguoidung");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchJobSeekers();
    fetchUsers();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJobSeeker((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new job seeker
  const handleAddJobSeeker = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/ngtviec", newJobSeeker);
      setJobSeekers((prev) => [...prev, response.data]);
      setNewJobSeeker({
        email: "",
        ten: "",
        SDT: "",
        image: "",
        MaND: "",
        gioitinh: 1,
        fileCV: "",
        Soluongnophoso: 0,
      });
    } catch (error) {
      console.error("Error adding job seeker:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Người Tìm Việc
      </h1>

      {/* Form to add a new job seeker */}
      <form
        onSubmit={handleAddJobSeeker}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={newJobSeeker.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tên</label>
            <input
              type="text"
              name="ten"
              value={newJobSeeker.ten}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập tên"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Số điện thoại</label>
            <input
              type="text"
              name="SDT"
              value={newJobSeeker.SDT}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Hình ảnh</label>
            <input
              type="text"
              name="image"
              value={newJobSeeker.image}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="URL hình ảnh"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Giới tính</label>
            <select
              name="gioitinh"
              value={newJobSeeker.gioitinh}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value={1}>Nam</option>
              <option value={2}>Nữ</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">File CV</label>
            <input
              type="text"
              name="fileCV"
              value={newJobSeeker.fileCV}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="URL file CV"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mã Người Dùng</label>
            <select
              name="MaND"
              value={newJobSeeker.MaND}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Chọn mã người dùng</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.ten}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Số lượng nộp hồ sơ
            </label>
            <input
              type="number"
              name="Soluongnophoso"
              value={newJobSeeker.Soluongnophoso}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập số lượng nộp hồ sơ"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm Người Tìm Việc
        </button>
      </form>

      {/* Table to display job seekers */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Tên</th>
            <th className="px-4 py-2">SĐT</th>
            <th className="px-4 py-2">Giới Tính</th>
            <th className="px-4 py-2">File CV</th>
            <th className="px-4 py-2">Số lượng nộp hồ sơ</th>
          </tr>
        </thead>
        <tbody>
          {jobSeekers.map((jobSeeker) => (
            <tr key={jobSeeker.MaND} className="border-b">
              <td className="px-4 py-2">{jobSeeker.email}</td>
              <td className="px-4 py-2">{jobSeeker.ten}</td>
              <td className="px-4 py-2">{jobSeeker.SDT}</td>
              <td className="px-4 py-2">
                {jobSeeker.gioitinh === 1 ? "Nam" : "Nữ"}
              </td>
              <td className="px-4 py-2">{jobSeeker.fileCV}</td>
              <td className="px-4 py-2">{jobSeeker.Soluongnophoso}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Button to export table data to PDF */}
      <button
        onClick={exportToPDF}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Export to PDF
      </button>
    </div>
  );
}

export default JobSeekerManagement;
