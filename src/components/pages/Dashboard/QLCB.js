import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function JobLevelManagement() {
  const [jobLevel, setJobLevel] = useState({
    ten: "",
  });

  const [jobLevels, setJobLevels] = useState([]);

  // Fetch job levels from the backend
  const fetchJobLevels = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3060/vieclamit/capbac"
      );
      console.log("Job Levels:", response.data);
      setJobLevels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching job levels:", error);
    }
  };

  useEffect(() => {
    fetchJobLevels();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobLevel((prev) => ({ ...prev, [name]: value }));
  };

  // Export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Set title and metadata
    doc.setFontSize(18);
    doc.text("Cấp bậc", 14, 20);
    doc.setFontSize(12);

    // Prepare headers and data for the table
    const headers = [["ID", "Tên cấp bậc"]];
    const rows = jobLevels.map((level) => [level.id, level.ten]);

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
    doc.save("job_levels_list.pdf");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3060/vieclamit/capbac",
        jobLevel
      );
      setJobLevels((prev) => [...prev, response.data.data]);
      setJobLevel({ ten: "" }); // Reset the form
    } catch (error) {
      console.error("Error adding job level:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Quản lý cấp bậc</h1>

      {/* Job Level Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block font-semibold mb-1">Tên cấp bậc</label>
          <input
            type="text"
            name="ten"
            value={jobLevel.ten}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Nhập tên cấp bậc"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
      </form>

      {/* Job Level Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg mt-6 shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2 text-center border-r">ID</th>
            <th className="px-4 py-2 text-center">Tên cấp bậc</th>
          </tr>
        </thead>
        <tbody>
          {jobLevels.map((level) => (
            <tr key={level.id} className="border-b">
              <td className="px-4 py-2 text-center border-r">{level.id}</td>
              <td className="px-4 py-2 text-center">{level.ten}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Export to PDF Button */}
      <button
        onClick={exportToPDF}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Export to PDF
      </button>
    </div>
  );
}
