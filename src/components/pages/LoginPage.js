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
import { toast } from "react-toastify";
import log from "../services/auth/login";
import { useDispatch } from "react-redux";
import { login } from '../slice/authSlice';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
//import Logo from "@/img/logo.png";

function Login() {
  
  const navigate = useNavigate();
  const [username, setUsername] = useState("HS230001");
  const [password, setPassword] = useState("123Admin");
  const [valid, setValid] = useState({ username: true, password: true });
  const dispatch = useDispatch();
  console.log("dakda")
  const handleSummit = async () => {
    let check = true;
    if (!username) {
      check = false;
      setValid({ ...valid, username: false });
      toast.error("Please enter your username");
    }
    if (!password) {
      check = false;
      setValid({ ...valid, username: false });
      toast.error("Please enter your password");
    }
    if (check) {
      // api
      const res = await log(username, password);
      console.log(res);

      if (res && +res.code === 0) {
        localStorage.setItem("token", `${res.data.access_token}`);
        toast.success(res.message);
        localStorage.setItem("isAuth", true);
        localStorage.setItem("username", res.data.name);
        localStorage.setItem("group_id", res.data.group_id);
        localStorage.setItem("role", res.data.role);
        dispatch(login({ ...res.data, isAuth: true }));
      }
      if (res && +res.code !== 0) {
        toast.error(res.message);
      }
    }
  };
  const handleGoogleSummit = async () => {
      // api
      const res = await axios.get('/google/callback');
      console.log(res);

      if (res && +res.code === 0) {
        localStorage.setItem("token", `${res.data.access_token}`);
        toast.success(res.message);
        console.log(res.data);
        // localStorage.setItem("isAuth", true);
        localStorage.setItem("username", res.data.name);
        localStorage.setItem("group_id", res.data.group_id);
        localStorage.setItem("role", res.data.role);
        dispatch(login({ ...res.data, isAuth: true }));
      }
      if (res && +res.code !== 0) {
        toast.error(res.message);
      }
    
  };
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Đăng Nhập</h1>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs">
                <input
                name="username"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                  className={'w-full px-8 py-4 rounded-lg font-medium bg-gray-100 ${!valid.username ? "border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white" :"" }'}
                
                  placeholder="Email"
                />
                <input
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                  className={'w-full px-8 py-4 rounded-lg font-medium bg-gray-100 ${!valid.password ? "border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5" : "" }'}
                  placeholder="Password"
                />
                <button  type="submit"
              onClick={handleSummit} 
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
                  <span className="ml-3">Đăng Nhập</span>
                 
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

export default Login;
