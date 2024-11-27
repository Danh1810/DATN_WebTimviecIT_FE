import axios from "../axios";

const Login = async (email, password) => {
  return axios.post(
    "/login",
    {
      email,
      password,
    },
    { withCredentials: true }
  );
};
export default Login;
