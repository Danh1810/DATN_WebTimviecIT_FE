import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Form, Link } from "react-router-dom"; // Import Link for routing

function JobApplicationForm() {
  const [jobPosts, setJobPosts] = useState([]);
  const [employers, setEmployers] = useState([]);
  const id = localStorage.getItem("id");
  const [applications, setApplications] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedEmployer, setSelectedEmployer] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalFile, setModalFile] = useState(null);
  const [status, setStatus] = useState("");
  const [hoso, sethoso] = useState([]);
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
  const fetchhoso = async () => {
    try {
      const response = await axios.get("/Ut/ntv", { params: { id: id } });
      console.log("🚀 ~ fetchhoso ~ response:", response.data);
      const hoso = response.data; // Safely access the nested `hoso` array
      sethoso(hoso);
    } catch (error) {
      console.error("Error fetching CV data:", error);
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

  useEffect(() => {
    fetchhoso();
    fetchJobPosts();
    fetchEmployers();
    fetchApplications();
  }, []);

  return (
    <div className="container mx-auto p-4  min-h-screen">
      <h2 className="text-2xl font-semibold mb-6 text-center">Ứng tuyển</h2>
      <div className="bg-white-100 p-4 rounded">
        <table className="table-auto w-full text-left">
          <thead>
            <tr className="text-gray-600 font-medium">
              <th className="px-4 py-2">Tên Công Việc </th>
              <th className="px-4 py-2">Tên hồ sơ đã nộp</th>
              <th className="px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {hoso.length === 0 ? (
              <tr>
                <td className="px-4 py-2 text-center" colSpan="4">
                  Bạn chưa ứng tuyển công việc nào
                </td>
              </tr>
            ) : (
              hoso.map((hs) => (
                <tr className="text-gray-800" key={hs.id}>
                  <td className="border-t px-6 py-3">{hs.UT_TTD.tieude}</td>
                  <td className="border-t px-6 py-3">{hs.UT_NTV.tenhoso}</td>
                  <td className="border-t px-6 py-3">{hs.trangthai}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobApplicationForm;
