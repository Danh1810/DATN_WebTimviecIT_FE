import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function SkillsManager() {
  const [skills, setSkills] = useState([]); // List of all skills
  const [newSkill, setNewSkill] = useState(""); // State to manage new skill input

  // Fetch all skills from the backend
  const fetchSkills = async () => {
    try {
      const response = await axios.get("/kynang");
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  // Export skills to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Set title and metadata
    doc.setFontSize(18);
    doc.text("Kỹ năng", 14, 20);
    doc.setFontSize(12);

    // Prepare headers and data for table
    const headers = [["ID", "Tên"]];
    const rows = skills.map((skill) => [skill.id, skill.ten]);

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
    doc.save("skills_list.pdf");
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add a new skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    try {
      const response = await axios.post("/kynang", { ten: newSkill });
      setSkills((prev) => [...prev, response.data]); // Add the new skill to the list
      setNewSkill(""); // Clear input
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Quản lý Kỹ năng</h1>

      {/* Form to add a new skill */}
      <form
        onSubmit={handleAddSkill}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <label className="block font-semibold mb-2">Thêm kỹ năng mới</label>
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Nhập tên kỹ năng"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm kỹ năng
        </button>
      </form>

      {/* Table to display skills */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Tên kỹ năng</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.id} className="border-b">
              <td className="px-4 py-2">{skill.id}</td>
              <td className="px-4 py-2">{skill.ten}</td>
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

export default SkillsManager;
