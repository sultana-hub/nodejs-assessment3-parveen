import axios from 'axios'
import { baseUrl } from '../api/url'



const axiosInstance = axios.create({
  baseURL: baseUrl, 

});

axiosInstance.interceptors.request.use(
    async function (config){
      const token=sessionStorage.getItem("token")||localStorage.getItem("token");
    //   console.log("taken",token) ;
      if(token){
        config.headers["x-access-token"]=token;

      }
      return config;
    },
    function(err){
        return Promise.reject(err);
    }
)


export default axiosInstance;

export const imagePath = (path) => {
   if (!path) return "";
  return `${baseUrl}${path.replace(/\\/g, '/')}`; // Replace backslashes with slashes
};