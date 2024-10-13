import axios from "../axios"

export const Logout = async () => {
  const res = await axios.get("/logout", {
    withCredentials: true,
  });
  console.log(res)
  return res
};