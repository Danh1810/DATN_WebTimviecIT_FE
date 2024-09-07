import axios from "../axios";

const Login = async (username, password) => {
  return axios.post(
    "/login",
    {
      username,
      password,
    },
    { withCredentials: true }
  );
};
export default Login;