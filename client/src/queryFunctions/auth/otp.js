

import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'


export const otpVerification = async (otpAndEmail) => {

    try {
        console.log("user otp and email verify");
        const res = await axiosInstance.post(endPoints.otpEmailVerify, otpAndEmail)
        console.log("user otp and email", res);
        return res.data;
    } catch (error) {
        console.error(" Failed to email verify:", error.response?.data || error.message);
        throw error;
    }

};

export const resendOtp = async (emailData) => {
    try {
        console.log("resending otp");
        const res = await axiosInstance.post(endPoints.resendOtp, emailData)
        return res.data;
    } catch (error) {
        console.error(" Failed to email verify:", error.response?.data || error.message);
        throw error;
    }

};