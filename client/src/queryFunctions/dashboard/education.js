import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'


export const addEducation = async (data) => {
  
  try {
    const response = await axiosInstance.put(endPoints.addEducation, data);
    console.log("Edu data:", response.data);
    
    // If  API response is structured as { data: { ...profileData } }
    return response?.data;

    // If it's just { ...profileData } then return response.data
    // return response.data;

  } catch (error) {
    console.error("Error creating education:", error.response?.data || error.message);
    throw error; // rethrow so React Query (or caller) can handle it
  }
};

export const deleteEducation = async (edu_id,navigate) => {
   if (window.confirm("Are you sure you want to delete ?")) {
  try {
   
    const response = await axiosInstance.delete(`${endPoints.deleteEducation}${edu_id}`);
    console.log("Edu data deleted:", response.data);
     navigate(`/dashboard/${response.data.user._id}`); // Redirect to dashboard

  } catch (error) {
    console.error("Error deleting edu:", error.response?.data || error.message);
    throw error; // rethrow so React Query (or caller) can handle it
  }
}
};
