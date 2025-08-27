import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'


export const addExperience = async (data) => {
  try {
    const response = await axiosInstance.put(endPoints.addExperience, data);
    console.log("Exp data:", response.data);
    
    // If  API response is structured as { data: { ...profileData } }
    return response?.data;

    // If it's just { ...profileData } then return response.data
    // return response.data;

  } catch (error) {
    console.error("Error creating exp:", error.response?.data || error.message);
    throw error; // rethrow so React Query (or caller) can handle it
  }
};

export const deleteExperience = async (exp_id,navigate) => {

     if (window.confirm("Are you sure you want to delete ?")) {
  try {
    const response = await axiosInstance.delete(`${endPoints.deleteExperience}${exp_id}`);
    console.log("Exp data deleted:", response.data);
    
     navigate(`/dashboard/${response.data.user._id}`);

  } catch (error) {
    console.error("Error deleting exp:", error.response?.data || error.message);
    throw error; // rethrow so React Query (or caller) can handle it
  }
}
};

