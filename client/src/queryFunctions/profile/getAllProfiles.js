import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const getAllProfiles=async()=>{
    const response = await axiosInstance.get(endPoints.profiles)
    console.log("All profiles",response.data)
    return response.data
}