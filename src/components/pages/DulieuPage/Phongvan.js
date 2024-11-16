import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function InterviewChat() {
  const [interviewMessages, setInterviewMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({
    Noidung: "",
    MaNTD: "", // Employer ID
    MaNTV: "", // Job Seeker ID
  });
  const [employers, setEmployers] = useState([]);
  const [jobSeekers, setJobSeekers] = useState([]);

  // Export interview messages to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Interview Chat Messages", 14, 20);
    doc.setFontSize(12);

    // Prepare headers and data for table
    const headers = [["Date", "Employer ID", "Job Seeker ID", "Message"]];
    const rows = interviewMessages.map((msg) => [
      new Date(msg.Ngay).toLocaleDateString(),
      msg.MaNTD || "N/A",
      msg.MaNTV || "N/A",
      msg.Noidung,
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

    doc.save("interview_chat.pdf");
  };

  // Fetch interview messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/phongvan");
        setInterviewMessages(response.data);
      } catch (error) {
        console.error("Error fetching interview messages:", error);
      }
    };
    fetchMessages();
  }, []);

  // Fetch employers and job seekers
  useEffect(() => {
    const fetchEmployers = async () => {
      try {
        const response = await axios.get("/nhatd");
        setEmployers(response.data);
      } catch (error) {
        console.error("Error fetching employers:", error);
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

    fetchEmployers();
    fetchJobSeekers();
  }, []);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.Noidung && newMessage.MaNTD && newMessage.MaNTV) {
      try {
        const response = await axios.post("/phongvan", newMessage);
        setInterviewMessages([...interviewMessages, response.data]);
        setNewMessage({ ...newMessage, Noidung: "" });
      } catch (error) {
        console.error("Error sending interview message:", error);
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Phỏng vấn</h2>

      {/* Export to PDF Button */}
      <div className="text-right mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      {/* Interview Messages Table */}
      <div className="mb-4 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Ngày</th>
              <th className="px-4 py-2 border-b">Mã NTD</th>
              <th className="px-4 py-2 border-b">Mã NTV</th>
              <th className="px-4 py-2 border-b">Nội dung</th>
            </tr>
          </thead>
          <tbody>
            {interviewMessages.map((msg) => (
              <tr key={msg.id}>
                <td className="px-4 py-2 border-b">
                  {new Date(msg.Ngay).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border-b">{msg.MaNTD || "N/A"}</td>
                <td className="px-4 py-2 border-b">{msg.MaNTV || "N/A"}</td>
                <td className="px-4 py-2 border-b">{msg.Noidung}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Message Form */}
      <form
        onSubmit={handleSendMessage}
        className="flex flex-col md:flex-row items-center"
      >
        <input
          type="text"
          name="Noidung"
          value={newMessage.Noidung}
          onChange={handleChange}
          placeholder="Nhập nội dung phỏng vấn..."
          className="flex-1 p-2 border rounded-lg mb-2 md:mb-0 md:mr-2"
        />

        <select
          name="MaNTD"
          value={newMessage.MaNTD}
          onChange={handleChange}
          className="p-2 border rounded-lg mb-2 md:mb-0 md:mr-2"
        >
          <option value="">Chọn Nhà Tuyển Dụng</option>
          {employers.map((employer) => (
            <option key={employer.id} value={employer.id}>
              {employer.ten}
            </option>
          ))}
        </select>

        <select
          name="MaNTV"
          value={newMessage.MaNTV}
          onChange={handleChange}
          className="p-2 border rounded-lg mb-2 md:mb-0 md:mr-2"
        >
          <option value="">Chọn Người Tìm Việc</option>
          {jobSeekers.map((jobSeeker) => (
            <option key={jobSeeker.id} value={jobSeeker.id}>
              {jobSeeker.ten}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}

export default InterviewChat;
