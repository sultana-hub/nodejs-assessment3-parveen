import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const getCurrentProfile=async()=>{
    const response = await axiosInstance.get(endPoints.currentProfile)
    console.log("Current profile",response.data)
    return response?.data?.data
}