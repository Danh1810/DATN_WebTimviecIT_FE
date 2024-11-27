import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../services/axios";
import { Toast } from "react-toastify";

function Signup() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    MaQuyen: "", // Adding MaQuyen to inputs to store selected role
  });
  const [roles, setRoles] = useState([]); // Adding state for roles
  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("Field changed:", name, "Value:", value); // Kiểm tra giá trị
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
        console.log("dd", response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/register", inputs);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Email đã tồn tại!"); // Display specific error message
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
    console.log("🚀 ~ handleSubmit ~ inputs:", inputs);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Đăng ký </h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                  type="text"
                  name="username"
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  placeholder="Username"
                />
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
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
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round" // Corrected spelling here
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Đăng ký</span>
                </button>
                {err && <p className="mt-3 text-red-500">{err}</p>}{" "}
                {/* Display error message */}
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
