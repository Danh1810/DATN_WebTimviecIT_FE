import axios from "../axios"; // Import axios đã được cấu hình

const Signup = async (username, email, password) => {
  return axios.post(
    "/register",
    {
      username,
      email,
      password,
    },
    { withCredentials: true } // Tương tự với đăng nhập, có thể cần cookie hoặc thông tin xác thực
  );
};

export default Signup;
