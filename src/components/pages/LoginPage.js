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
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = "Email không được bỏ trống";
      toast.error(errors.email);
    }
    if (!password) {
      errors.password = "Bạn chưa nhập mật khẩu";
      toast.error(errors.password);
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    console.time("login-process");
    e.preventDefault();

    // Validate form inputs
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      toast.error("Vui lòng kiểm tra thông tin đăng nhập");
      return;
    }

    // Trim and validate inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await log(trimmedEmail, trimmedPassword);
      console.log("🚀 ~ handleSubmit ~ res:", res.data);

      // Detailed response handling
      if (res && res.code === 0 && Object.keys(res.data).length > 0) {
        // Successful login logic
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("isAuth", true);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("group_id", res.data.Quyen);
        localStorage.setItem("role", res.data.TenQuyen);
        localStorage.setItem("id", res.data.userid);
        dispatch(login({ ...res.data, isAuth: true }));

        toast.success(res.message || "Đăng nhập thành công");

        // Navigation based on role
        try {
          switch (res.data.TenQuyen) {
            case "admin":
              navigate("/dashboard/overview");
              break;
            case "ntd":
              navigate("/ntd/thongtin");
              break;
            default:
              navigate("/homepage");
          }
        } catch (navigationError) {
          console.error("Navigation Error:", navigationError);
          toast.error("Không thể chuyển trang. Vui lòng thử lại.");
        }
      } else {
        // Handle specific error scenarios
        handleLoginError(res);
      }
    } catch (error) {
      // Comprehensive Axios error handling
      handleAxiosError(error);
    } finally {
      console.timeEnd("login-process");
    }
  };

  // Separate function to handle login-specific errors
  const handleLoginError = (res) => {
    // Map of error codes to user-friendly messages
    const errorMessages = {
      3: "Thông tin đăng nhập không chính xác",
      4: "Email chưa được xác thực",
      5: "Tài khoản đã bị khóa",
      "-1": "Đã xảy ra lỗi. Vui lòng thử lại",
    };

    const errorMessage =
      errorMessages[res?.code] || res?.message || "Đăng nhập không thành công";

    toast.error(errorMessage);
  };

  // Comprehensive Axios error handler
  const handleAxiosError = (error) => {
    console.error("Login Error:", error);

    // Default error message
    let errorMessage = "Đã xảy ra lỗi. Vui lòng thử lại";

    if (error.response) {
      // Server responded with an error status
      switch (error.response.status) {
        case 400:
          errorMessage = "Thông tin đăng nhập không hợp lệ";
          break;
        case 401:
          errorMessage = "Thông tin đăng nhập không chính xác";
          break;
        case 403:
          errorMessage = "Truy cập bị từ chối";
          break;
        case 404:
          errorMessage = "Không tìm thấy dịch vụ đăng nhập";
          break;
        case 500:
          errorMessage = "Lỗi máy chủ. Vui lòng thử lại sau";
          break;
        default:
          errorMessage = error.response.data?.message || errorMessage;
      }
    } else if (error.request) {
      // Request made but no response received
      errorMessage =
        "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet";
    }

    toast.error(errorMessage);
  };

  return (
    <div>
      <div className=" bg-gray-100 flex justify-center items-center">
        <div className="mt-64 max-w-md w-full bg-white shadow-md rounded-lg p-8">
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
