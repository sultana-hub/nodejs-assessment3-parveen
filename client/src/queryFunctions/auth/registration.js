
import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const register=async(data)=>{
    const res=await axiosInstance.post(endPoints.register,data,{
         headers: { 'Content-Type': 'multipart/form-data' },
    })
 
    console.log("registerd data",res.data)
    return res.data

}