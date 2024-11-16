import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function JobPostSkills() {
  const [skills, setSkills] = useState([]); // All available skills
  const [jobPosts, setJobPosts] = useState([]); // All job posts
  const [jobPostSkills, setJobPostSkills] = useState([]); // Skills linked to job posts
  const [selectedJobPost, setSelectedJobPost] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  // Fetch all skills from backend
  const fetchSkills = async () => {
    try {
      const response = await axios.get("/kynang");
      setSkills(response.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  // Fetch all job posts from backend
  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd");
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  // Fetch job post skills associations from backend
  const fetchJobPostSkills = async () => {
    try {
      const response = await axios.get("/Kntt");
      setJobPostSkills(response.data);
    } catch (error) {
      console.error("Error fetching job post skills:", error);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchJobPosts();
    fetchJobPostSkills();
  }, []);

  // Handle adding a skill to a job post
  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/Kntt", {
        MaTTD: selectedJobPost,
        MaKN: selectedSkill,
      });
      setJobPostSkills((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding skill to job post:", error);
    }
  };

  // Export job post skills to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Kỹ năng tuyển dụng", 14, 20);
    doc.setFontSize(12);

    const headers = [["Tin tuyển dụng", "Kỹ năng"]];
    const rows = jobPostSkills.map((association) => [
      jobPosts.find((post) => post.id === association.MaTTD)?.title || "N/A",
      skills.find((skill) => skill.id === association.MaKN)?.ten || "N/A",
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

    doc.save("job_post_skills.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Kỹ năng cho Tin tuyển dụng
      </h1>

      {/* Form to add skill to a job post */}
      <form
        onSubmit={handleAddSkill}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Chọn Tin tuyển dụng
          </label>
          <select
            value={selectedJobPost}
            onChange={(e) => setSelectedJobPost(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Chọn Tin tuyển dụng --</option>
            {jobPosts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.tieude}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-1">Chọn Kỹ năng</label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Chọn kỹ năng --</option>
            {skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.ten}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm Kỹ năng
        </button>
      </form>

      {/* Table to display job post skills */}
      <table className="min-w-full bg-white border rounded-lg mt-6 shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Tin tuyển dụng</th>
            <th className="px-4 py-2">Kỹ năng</th>
          </tr>
        </thead>
        <tbody>
          {jobPostSkills.map((association) => (
            <tr
              key={`${association.MaTTD}-${association.MaKN}`}
              className="border-b"
            >
              <td className="px-4 py-2">
                {jobPosts.find((post) => post.id === association.MaTTD)
                  ?.tieude || "N/A"}
              </td>
              <td className="px-4 py-2">
                {skills.find((skill) => skill.id === association.MaKN)?.ten ||
                  "N/A"}
              </td>
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

export default JobPostSkills;
