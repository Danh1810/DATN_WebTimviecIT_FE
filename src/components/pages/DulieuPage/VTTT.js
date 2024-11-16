import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function JobPositionForm() {
  const [jobPosts, setJobPosts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedJobPost, setSelectedJobPost] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [jobPositionAssociations, setJobPositionAssociations] = useState([]);

  // Fetch job posts and employees from API
  useEffect(() => {
    fetchJobPosts();
    fetchEmployees();
    fetchJobPositionAssociations();
  }, []);

  const fetchJobPosts = async () => {
    try {
      const response = await axios.get("/tintd"); // Replace with the correct endpoint for job posts
      setJobPosts(response.data);
    } catch (error) {
      console.error("Error fetching job posts:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("/capbac"); // Replace with the correct endpoint for employees
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchJobPositionAssociations = async () => {
    try {
      const response = await axios.get("/vtri"); // Replace with the correct endpoint for job position associations
      setJobPositionAssociations(response.data);
    } catch (error) {
      console.error("Error fetching job position associations:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      MaTTD: selectedJobPost,
      MaCB: selectedEmployee,
    };

    try {
      await axios.post("/vtri", data); // Replace with the correct endpoint to add the association
      fetchJobPositionAssociations(); // Refresh the job positions list
      alert("Job position association added successfully!");
    } catch (error) {
      console.error("Error adding job position association:", error);
    }
  };

  // Export job position associations to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Add title
    doc.setFontSize(18);
    doc.text("Job Position Associations", 14, 20);
    doc.setFontSize(12);

    // Prepare data for the table
    const headers = [["ID", "Mã TTD", "Mã CB"]];
    const rows = jobPositionAssociations.map((association) => [
      association.id,
      association.MaTTD,
      association.MaCB,
    ]);

    // Create the table
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
    doc.save("job_position_associations.pdf");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Vị trí tuyển dụng
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mã Tin tuyển dụng
          </label>
          <select
            value={selectedJobPost}
            onChange={(e) => setSelectedJobPost(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled></option>
            {jobPosts.map((job) => (
              <option key={job.id} value={job.id}>
                {job.tieude}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Mã cập bậc
          </label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="" disabled>
              Chọn mã Cấp bậc
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.ten}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600"
        >
          Lưu
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-center">
        Vị trí tuyển dụng
      </h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        >
          Export to PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Mã TTD</th>
              <th className="px-4 py-2 border-b">Mã CB</th>
            </tr>
          </thead>
          <tbody>
            {jobPositionAssociations.map((association) => (
              <tr key={association.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">{association.id}</td>
                <td className="px-4 py-2 border-b">{association.MaTTD}</td>
                <td className="px-4 py-2 border-b">{association.MaCB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default JobPositionForm;
