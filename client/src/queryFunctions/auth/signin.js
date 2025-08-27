import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const userSignin=async(data)=>{
    const res=await axiosInstance.post(endPoints.login,data)
    console.log("registerd data",res.data)
    return res.data

}