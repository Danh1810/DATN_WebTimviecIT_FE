import Axios from "./axios";

export const getTintdbyID = async (id) => {
  if (!id) {
    throw new Error("ID parameter is required");
  }

  try {
    const response = await Axios.get(`/tintd/details`, {
      params: { id },
    });
    return response;
  } catch (error) {
    console.error("Error in getTintdbyID:", error.message);
    throw error;
  }
};
