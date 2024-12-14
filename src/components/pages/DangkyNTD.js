import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import { toast } from "react-toastify";

function SignupNTD() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    MaQuyen: 2,

    ten: "",
    emailNTD: "",
    sdt: "",
    diachi: "",
    website: "",
    linhvuc: "",
  });
  const [err, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Password strength calculation
    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (value.match(/[a-z]+/)) strength++;
      if (value.match(/[A-Z]+/)) strength++;
      if (value.match(/[0-9]+/)) strength++;
      if (value.match(/[$@#&!]+/)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/registerntd", inputs);
      toast.success("Đăng ký thành công! Kiểm tra email để xác minh.");
      setSuccess("Đăng ký thành công! Kiểm tra email để xác minh.");
      setError(null);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Email đã tồn tại!");
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl max-w-5xl w-full p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Đăng Ký Nhà Tuyển Dụng
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Account Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Thông Tin Tài Khoản
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  name="username"
                  value={inputs.username}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên người dùng"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  required
                  placeholder="Nhập địa chỉ email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  required
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {/* Password Strength Indicator */}
                <div className="mt-2 flex">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-1/5 mr-1 rounded ${
                        index < passwordStrength
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Employer Details */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Thông Tin Nhà Tuyển Dụng
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">
                  Tên nhà tuyển dụng
                </label>
                <input
                  type="text"
                  name="ten"
                  value={inputs.ten}
                  onChange={handleChange}
                  placeholder="Nhập tên công ty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  name="sdt"
                  value={inputs.sdt}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Địa chỉ</label>
                <input
                  type="text"
                  name="diachi"
                  value={inputs.diachi}
                  onChange={handleChange}
                  placeholder="Nhập địa chỉ công ty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Website</label>
                <input
                  type="text"
                  name="website"
                  value={inputs.website}
                  onChange={handleChange}
                  placeholder="Nhập website công ty"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Lĩnh vực</label>
                <input
                  type="text"
                  name="linhvuc"
                  value={inputs.linhvuc}
                  onChange={handleChange}
                  placeholder="Nhập lĩnh vực hoạt động"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="text"
                  name="emailNTD"
                  value={inputs.emailNTD}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg text-lg"
            >
              Hoàn Tất Đăng Ký
            </button>
          </div>

          {/* Validation Messages */}
          {success && (
            <p className="text-center text-green-600 mt-4 text-lg">{success}</p>
          )}
          {err && (
            <p className="text-center text-red-600 mt-4 text-lg">{err}</p>
          )}

          {/* Login Link */}
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-indigo-600 hover:underline text-lg"
            >
              Đã có tài khoản? Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupNTD;
