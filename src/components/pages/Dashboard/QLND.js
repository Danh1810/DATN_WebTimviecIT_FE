import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    username: "",
    ten: "",
    MaQuyen: "",
    Trangthai: "active",
  });
  const [searchTerm, setSearchTerm] = useState(""); // Search state

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/nguoidung");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/quyen");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFont("Roboto-Regular");
    doc.setFontSize(18);
    doc.text("Người dùng", 14, 20);
    doc.setFontSize(12);

    const headers = [["ID", "Name", "Email", "Role", "Status"]];
    const rows = users.map((user) => [
      user.id,
      user.username,
      user.email,
      user.MaQuyen,
      user.Trangthai,
    ]);

    doc.autoTable({
      head: headers,
      body: rows,
      startY: 30,
      theme: "striped",
      styles: { font: "Roboto-Regular", fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontSize: 11 },
    });

    doc.save("user_list.pdf");
  };

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
      setIsModalOpen(false); // Close modal after adding
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (roles.find((rec) => rec.id === user.MaQuyen)?.mota || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.Trangthai.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Quản lý Người Dùng
      </h1>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thêm Người Dùng
        </button>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-1/3"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h2 className="text-xl font-bold mb-4">Thêm Người Dùng</h2>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 mb-4">
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
                  <label className="block font-semibold mb-1">
                    Tên người dùng
                  </label>
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
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="min-w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Tên Người Dùng</th>
            <th className="px-4 py-2">Quyền</th>
            <th className="px-4 py-2">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.username}</td>
              <td className="px-4 py-2">
                {roles.find((rec) => rec.id === user.MaQuyen)?.mota || "N/A"}
              </td>
              <td className="px-4 py-2">{user.Trangthai}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={exportToPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Export
      </button>
    </div>
  );
}

export default UserManagement;
