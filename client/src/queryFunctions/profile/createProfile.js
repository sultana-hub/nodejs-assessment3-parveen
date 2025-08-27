import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const createProfile = async (data) => {
  try {
    const response = await axiosInstance.post(endPoints.createProfile, data);
    console.log("Current profile:", response.data);
    
    // If  API response is structured as { data: { ...profileData } }
    return response?.data;

    // If it's just { ...profileData } then return response.data
    // return response.data;

  } catch (error) {
    console.error("Error creating profile:", error.response?.data || error.message);
    throw error; // rethrow so React Query (or caller) can handle it
  }
};
