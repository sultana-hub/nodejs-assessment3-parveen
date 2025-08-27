import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

// it delete profile and user data 

 export const deleteProfile = async (navigate,queryClient) => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axiosInstance.delete(endPoints.deleteProfileAndUser, { withCredentials: true });
       sessionStorage.clear();
         queryClient.clear();
        // Clear token, state, or logout here if needed
        navigate('/'); // Redirect to home
      } catch (err) {
        console.error(err);
        alert("Something went wrong while deleting your profile.");
      }
    }
  };


