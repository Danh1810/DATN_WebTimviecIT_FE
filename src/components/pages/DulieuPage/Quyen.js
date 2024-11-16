import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ mota: "", URL: "" });

  // Fetch roles from the backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/quyen");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Set title and metadata
    doc.setFontSize(18);
    doc.text("Role List", 14, 20);
    doc.setFontSize(12);

    // Prepare headers and data for table
    const headers = [["ID", "Tên Quyền", "URL"]];
    const rows = roles.map((role) => [
      role.id,
      role.ten,
      JSON.stringify(role.URL),
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
    doc.save("role_list.pdf");
  };

  // Handle adding a new role
  const handleAddRole = async (e) => {
    e.preventDefault();
    try {
      const parsedURL = JSON.parse(newRole.URL); // Attempt to parse JSON
      const response = await axios.post("/quyen", {
        ten: newRole.ten,
        URL: parsedURL,
      });
      setRoles([...roles, response.data]);
      setNewRole({ ten: "", URL: "" });
    } catch (error) {
      if (error instanceof SyntaxError) {
        alert("Invalid JSON format for URL field.");
      } else {
        console.error("Error adding role:", error);
      }
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4">Quản lý Quyền</h2>

      {/* Export to PDF Button */}
      <div className="text-right mb-4">
        <button
          onClick={exportToPDF}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to PDF
        </button>
      </div>

      {/* Roles Table */}
      <div className="mb-4">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="border-b bg-gray-200">
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Tên Quyền</th>
              <th className="px-4 py-2 text-left">URL</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="border-b">
                <td className="px-4 py-2">{role.id}</td>
                <td className="px-4 py-2">{role.mota}</td>
                <td className="px-4 py-2">{JSON.stringify(role.URL)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Role Form */}
      <form onSubmit={handleAddRole} className="flex flex-col space-y-2">
        <input
          type="text"
          name="mota"
          value={newRole.mota}
          onChange={handleChange}
          placeholder="Tên quyền"
          className="p-2 border rounded-lg"
        />
        <input
          type="text"
          name="URL"
          value={newRole.URL}
          onChange={handleChange}
          placeholder='URL (JSON format, e.g., {"view": "/home", "edit": "/edit"})'
          className="p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Thêm Quyền
        </button>
      </form>
    </div>
  );
}

export default RoleManagement;
