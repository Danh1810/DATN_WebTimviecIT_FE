import React, { useState } from "react";
import { toast } from "react-toastify";
import log from "../services/auth/login";
import { login } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      isValid = false;
      newErrors.email = "Email không được bỏ trống";
      toast.error(newErrors.email);
    }
    if (!password) {
      isValid = false;
      newErrors.password = "Bạn chưa nhập mật khẩu";
      toast.error(newErrors.password);
    }

    setErrors(newErrors);

    if (isValid) {
      try {
        const res = await log(email, password);
        console.log("🚀 ~ handleSubmit ~ res:", res);

        if (res && +res.code === 0) {
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("isAuth", true);
          localStorage.setItem("username", res.data.username);
          localStorage.setItem("group_id", res.data.Quyen);
          localStorage.setItem("role", res.data.TenQuyen);
          localStorage.setItem("id", res.data.userid);

          dispatch(login({ ...res.data, isAuth: true }));
          toast.success(res.message);

          // Navigate to dashboard or home based on role
          if (res.data.TenQuyen === "admin") {
            navigate("/dashboardadmin");
          } else if (res.data.TenQuyen === "ntd") {
            navigate("/se");
          } else {
            navigate("/homepage");
          }
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi đăng nhập");
        console.error("Login Error:", error);
      }
    }
  };

  return (
    <div>
      <nav className="bg-purple-700 text-white flex items-center justify-between p-4">
        <div
          onClick={() => (window.location.href = "/home")}
          className="flex items-center space-x-4"
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREfsesMJwwXL8130hzXhA8LtGBG1HMN6lKLA&s"
            alt="Company Logo"
            className="h-8"
          />
          <span className="text-xl font-bold">Việc Làm IT</span>
        </div>
        <div className="flex items-center space-x-1">
          <span>Dành cho</span>
          <span className="font-semibold">Nhà Tuyển Dụng</span>
        </div>
      </nav>

      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:bg-white focus:border-indigo-400`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
                className={`w-full px-4 py-3 rounded-lg bg-gray-100 border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } focus:outline-none focus:bg-white focus:border-indigo-400`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none"
            >
              Đăng Nhập
            </button>
          </form>
          <p className="text-center text-sm mt-4">
            Chưa có tài khoản?{" "}
            <a
              href="/singup"
              className="text-indigo-500 hover:underline font-semibold"
            >
              Đăng ký
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
