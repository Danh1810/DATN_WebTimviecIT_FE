// import React from "react";
// import { toast } from "react-toastify";
// // import { useNavigate } from "react-router-dom";

// const LoginPage: React.FC = () => {
//   // const navigate = useNavigate();

//   // const handleLogin = () => {
//   //   navigate("/dashboard");
//   // };

//   const handleSignUp = () =>{
//     toast.success('You click sign up')
//   }
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast } from "react-toastify" ;
import signup from "../services/auth/signup"
//import Logo from "@/img/logo.png";

function Signup() {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3060/vieclamit/register", inputs);
      navigate("/login");
  
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('Email đã tồn tại!'); // Hiển thị thông báo lỗi cụ thể
      } else {
        setError('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
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
                  placeholder="email"
                />
                <input
                type="password"
                name="password"
              
                onChange={handleChange}
                required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  placeholder="Password"
                />
                {/* <input
                type="password"
                name="confirmPassword"
    
                onChange={handleChange}
                
                required
                  className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  placeholder="ConfirmPassword"
                /> */}
                <button  type="submit"
              onClick={handleSubmit} 
              className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <svg
                    className="w-6 h-6 -ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    // strokeLinejoinn="round"
                  >
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6M23 11h-6" />
                  </svg>
                  <span className="ml-3">Đăng ký</span>
                 
                </button>

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
};

export default Signup;
