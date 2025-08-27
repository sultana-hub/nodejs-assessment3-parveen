
import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const getSingleProfile=async(userId)=>{
    const response = await axiosInstance.get(`${endPoints.profileById}${userId}`)
    console.log("Single profile",response.data)
    return response.data
}