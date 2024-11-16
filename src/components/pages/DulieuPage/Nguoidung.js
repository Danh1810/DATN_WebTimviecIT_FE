import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // List of roles for dropdown
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    username: "",
    ten: "",
    MaQuyen: "",
    Trangthai: "active", // Default status
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get("/nguoidung");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch roles from backend for dropdown
  const fetchRoles = async () => {
    try {
      const response = await axios.get("/quyen"); // Assume this endpoint returns list of roles
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    // Set title and metadata
    doc.setFontSize(18);
    doc.text("Người dùng", 14, 20);
    doc.setFontSize(12);

    // Prepare headers and data for table
    const headers = [["ID", "Name", "Email", "Role", "Status"]];
    const rows = users.map((user) => [
      user.id,
      user.username,
      user.email,
      user.MaQuyen,
      user.Trangthai,
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
    doc.save("user_list.pdf");
  };

  // Add a new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/nguoidung", newUser);
      setUsers((prev) => [...prev, response.data]);
      setNewUser({
        email: "",
        password: "",
        username: "",
        ten: "",
        MaQuyen: "",
        Trangthai: "active",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Người Dùng
      </h1>

      {/* Form to add a new user */}
      <form
        onSubmit={handleAddUser}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Tên người dùng</label>
            <input
              type="text"
              name="username"
              value={newUser.username}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Nhập tên người dùng"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Quyền</label>
            <select
              name="MaQuyen"
              value={newUser.MaQuyen}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Chọn Quyền --</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.mota}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Trạng Thái</label>
            <select
              name="Trangthai"
              value={newUser.Trangthai}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm Người Dùng
        </button>
      </form>

      {/* Table to display users */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Tên Người Dùng</th>
            <th className="px-4 py-2">Mật khẩu</th>
            <th className="px-4 py-2">Quyền</th>
            <th className="px-4 py-2">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">{user.password}</td>
              <td className="px-4 py-2">{user.MaQuyen}</td>
              <td className="px-4 py-2">{user.Trangthai}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={exportToPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Export
      </button>
    </div>
  );
}

export default UserManagement;
