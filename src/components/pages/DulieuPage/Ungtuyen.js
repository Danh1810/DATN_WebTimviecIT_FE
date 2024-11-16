import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import Modal from "react-modal";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Link } from "react-router-dom"; // Import Link for routing

Modal.setAppElement("#root"); // For accessibility

function JobApplicationForm() {
  const [jobPosts, setJobPosts] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchJobPosts();
    fetchEmployers();
    fetchApplications();
  }, []);

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchEmployers = async () => {
    try {
      const response = await axios.get("/ngtviec");
      setEmployers(response.data);
    } catch (error) {
      console.error("Error fetching employers:", error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await axios.get("/Ut");
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Application List", 14, 20);
    doc.setFontSize(12);

    const headers = [["ID", "Job ID", "Employer ID", "Date", "File"]];
    const rows = applications.map((app) => [
      app.id,
      app.MaTTD,
      app.MaNTV,
      new Date(app.NgayNop).toLocaleDateString(),
      app.file ? "Yes" : "No",
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
    doc.save("application_list.pdf");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleJobChange = (e) => {
    setSelectedJob(e.target.value);
  };

  const handleEmployerChange = (e) => {
    setSelectedEmployer(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("MaTTD", selectedJob);
    formData.append("MaNTV", selectedEmployer);

    try {
      await axios.post("/Ut", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted successfully!");
      fetchApplications();
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  const openModal = (fileUrl) => {
    setModalFile(fileUrl);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setModalFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">Ứng tuyển</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Tin Tuyển dụng
          </label>
          <select
            value={selectedJob}
            onChange={handleJobChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Chọn tin
            </option>
            {jobPosts.map((job) => (
              <option key={job.id} value={job.id}>
                {job.tieude}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Người tìm việc
          </label>
          <select
            value={selectedEmployer}
            onChange={handleEmployerChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Chọn người tìm việc
            </option>
            {employers.map((employer) => (
              <option key={employer.id} value={employer.id}>
                {employer.ten}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Trạng thái
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Chọn trạng thái
            </option>
            <option value="Pending">Đã nộp</option>
            <option value="Approved">Đã xem</option>
            <option value="Rejected">Phỏng vấn</option>
            <option value="Rejected">Đã duyệt</option>
            <option value="Rejected">Từ chối</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">File</label>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
        >
          Lưu
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Mã TTD</th>
              <th className="px-4 py-2 border-b">MÃ NTV</th>
              <th className="px-4 py-2 border-b">Ngày</th>
              <th className="px-4 py-2 border-b">File</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b text-center">{app.id}</td>
                <td className="px-4 py-2 border-b">{app.MaTTD}</td>
                <td className="px-4 py-2 border-b">{app.MaNTV}</td>
                <td className="px-4 py-2 border-b text-center">
                  {new Date(app.NgayNop).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  {app.file ? (
                    <a
                      href={`${process.env.REACT_APP_SERVER_URL}/files/${app.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View File
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={exportToPDF}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
        >
          Export
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="View File Modal"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-xl w-full">
          <h2 className="text-xl font-semibold mb-4">File Preview</h2>
          {modalFile && (
            <iframe
              src={modalFile}
              title="File Preview"
              className="w-full h-96 border rounded"
            />
          )}
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default JobApplicationForm;
