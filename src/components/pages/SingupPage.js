import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";

function Signup() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    MaQuyen: "",
  });
  const [roles, setRoles] = useState([]);
  const [err, setError] = useState(null);
  const [success, setSuccess] = useState(null); // For success messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/quyen/dk"); // Adjust endpoint as needed
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/register", inputs);
      setSuccess("Đăng ký thành công! Kiểm tra email để xác minh.");
      setError(null);
      setInputs({
        username: "",
        email: "",
        password: "",
        MaQuyen: "",
      });

      // Optionally redirect to a login or verify email page after a short delay
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
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Đăng ký</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                  type="text"
                  name="username"
                  value={inputs.username}
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  placeholder="Username"
                />
                <input
                  type="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  placeholder="Password"
                />
                <select
                  name="MaQuyen"
                  value={inputs.MaQuyen}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-5"
                >
                  <option value="" disabled>
                    -- Chọn quyền --
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.mota}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span className="ml-3">Đăng ký</span>
                </button>
                {success && <p className="mt-3 text-green-500">{success}</p>}
                {err && <p className="mt-3 text-red-500">{err}</p>}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat bg-[url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')]"></div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
