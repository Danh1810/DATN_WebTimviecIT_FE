import axios from "./axios";

export const getJobpost = async () => {
  const res = await axios.get(`/jb`);
  return res;
};