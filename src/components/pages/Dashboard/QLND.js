import React, { useState, useEffect } from "react";
import axios from "../../services/axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [users1, setUsers1] = useState(null);
  const [users2, setUsers2] = useState(null);
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
  const closeModal2 = () => {
    setUsers1(null); // Đóng modal
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
      setIsModalOpen(false);
      fetchUsers(); // Close modal after adding
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
  const xemChiTiet = (id) => {
    const post = users.find((post) => post.id === id);
    setUsers1(post); // Lưu bài đăng được chọn vào state
  };
  const Chinhsua = (id) => {
    const post = users.find((post) => post.id === id);
    setUsers2(post); // Lưu bài đăng được chọn vào state
  };
  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setUsers2({
      ...users2, // Sao chép các trường hiện tại
      [name]: value, // Cập nhật trường đang thay đổi
    });
  };
  const handleSua = async () => {
    try {
      const response = await axios.put("/nguoidung/update", users2);
      console.log("🚀 ~ handleSua ~ response:", response);
      if (response.code === 0) {
        fetchUsers();
        alert("Cập nhật thành công!");
      } else {
        alert("Đã xảy ra lỗi khi cập nhật.");
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };
  const xoanguoidung = async (id) => {
    try {
      const response = await axios.delete("/nguoidung", {
        params: { id: id },
      });
      console.log("🚀 ~ handleSua ~ response:", response);
      if (response.code === 0) {
        fetchUsers();
        alert("Xóa thành công!");
      } else {
        alert("Đã xảy ra lỗi khi xóa");
      }
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

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
      <>
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
                    <label className="block font-semibold mb-1">
                      Trạng Thái
                    </label>
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
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 w-1/6 text-left">Email</th>
              <th className="px-4 py-2 w-1/6 text-left">Tên Người Dùng</th>
              <th className="px-4 py-2 w-1/6 text-left">Quyền</th>
              <th className="px-4 py-2 w-1/6 text-center">Trạng Thái</th>
              <th className="px-4 py-2 w-1/6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="px-4 py-2 truncate">{user.email}</td>
                <td className="px-4 py-2 truncate">{user.username}</td>
                <td className="px-4 py-2 truncate">
                  {roles.find((rec) => rec.id === user.MaQuyen)?.mota || "N/A"}
                </td>
                <td className="px-4 py-2 text-center">{user.Trangthai}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded "
                    onClick={() => xemChiTiet(user.id)}
                  >
                    Xem chi tiết
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded "
                    onClick={() => Chinhsua(user.id)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => xoanguoidung(user.id)}
                  >
                    Xóa
                  </button>
                </td>
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
        {users1 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="grid gap-4">
                <div>
                  <label className="block font-semibold text-lg mb-2">
                    Email:
                  </label>
                  <span className="text-gray-700">{users1.email}</span>
                </div>
                <div>
                  <label className="block font-semibold text-lg mb-2">
                    Tên người dùng:
                  </label>
                  <span className="text-gray-700">{users1.username}</span>
                </div>
                <div>
                  <label className="block font-semibold text-lg mb-2">
                    Quyền:
                  </label>
                  <span className="text-gray-700">
                    {roles.find((role) => role.id === users1.MaQuyen)?.mota ||
                      "Chưa chọn"}
                  </span>
                </div>
                <div>
                  <label className="block font-semibold text-lg mb-2">
                    Trạng Thái:
                  </label>
                  <span className="text-gray-700">
                    {users1.Trangthai === "Hoạt Động"
                      ? "Hoạt động"
                      : "Không hoạt động"}
                  </span>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={closeModal2}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {users2 && (
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
                      value={users2.email}
                      onChange={handleChange1}
                      className="w-full p-2 border rounded"
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Mật khẩu</label>
                    <input
                      type="password"
                      name="password"
                      value={users2.password}
                      onChange={handleChange1}
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
                      value={users2.username}
                      onChange={handleChange1}
                      className="w-full p-2 border rounded"
                      placeholder="Nhập tên người dùng"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Quyền</label>
                    <select
                      name="MaQuyen"
                      value={users2.MaQuyen}
                      onChange={handleChange1}
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
                    <label className="block font-semibold mb-1">
                      Trạng Thái
                    </label>
                    <select
                      name="Trangthai"
                      value={users2.Trangthai}
                      onChange={handleChange1}
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
                    onClick={() => setUsers2(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={handleSua}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Sửa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default UserManagement;
