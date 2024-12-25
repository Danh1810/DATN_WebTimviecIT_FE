import axios from "axios";

const baseURL = "https://datn-webtimviecit-be.onrender.com/vieclamit";
// const baseURL = "https://locahost:3060/vieclamit";
const instance = axios.create({
  baseURL: baseURL,
});

// Request interceptor to set the token dynamically
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    console.log("error", error);
    if (+error.response.data.code === 2) {
      localStorage.setItem("isAuth", false);
      localStorage.setItem("token", "");
      window.location.href = "/login";
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response.data);
  }
);

export default instance;
