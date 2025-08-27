import axiosInstance from '../../api/axiosInstance'
import { endPoints } from '../../api/url'

export const createPost = async (data) => {
  try {
    const response = await axiosInstance.post(endPoints.createPost, data);
    console.log("posted data :", response.data);

    // If  API response is structured as { data: { ...profileData } }
    return response?.data;

    // If it's just { ...profileData } then return response.data
    // return response.data;

  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw error; // rethrow so React Query (or caller) can handle it
  }
};


export const fetchPosts = async () => {
  try {
    const response = await axiosInstance.get(endPoints.getAllPosts);
    console.log("all post", response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching post:", error.response?.data || error.message);
    throw error; // rethrow so React Query (or caller) can handle it
  }

};

export const deletePost = async (postId) => {
  console.log("Trying to delete post:", postId);
  try {
    const res = await axiosInstance.delete(`${endPoints.deletePost}${postId}`);
    console.log("Deleted post", res.data);
    return res.data;
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error.message);
    throw error;
  }
};





export const likePost = async (postId) => {
  try {
    const res = await axiosInstance.put(`${endPoints.likePost}${postId}`);
    console.log('API CALL: like Post:', postId);
    return res.data;
  } catch (error) {
    console.error("Error fetching post:", error.response?.data || error.message);
    throw error;
  }

};

export const unlikePost = async (postId) => {
  try {
    const res = await axiosInstance.put(`${endPoints.unlikePost}${postId}`);
    console.log('API CALL: Unlike Post:', postId);
    return res.data;
  } catch (error) {
    console.error("Error fetching post:", error.response?.data || error.message);
    throw error;
  }

};

// postQuery.js
export const getPostById = async (postId) => {
  try {
    const res = await axiosInstance.get(`${endPoints.getPostById}${postId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching post by ID:", error.response?.data || error.message);
    throw error;
  }
};


export const createComment = async ({ postId, text }) => {
  try {
    const res = await axiosInstance.post(`${endPoints.createcomment}${postId}`, { text });
    return res.data;
  } catch (error) {
    console.error("Error creating comment:", error.response?.data || error.message);
    throw error;
  }
};

export const getComments = async (postId) => {
  try {
    const res = await axiosInstance.get(`${endPoints.getComments}${postId}`);
    return res.data.comments;
  } catch (error) {
    console.error("Error creating comment:", error.response?.data || error.message);
    throw error;
  }

};


export const deleteComment = async ({ postId, commentId }) => {
  try {
    const res = await axiosInstance.delete(`${endPoints.deleteComment}${postId}/${commentId}`);
    console.log('Comment deleted:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error deleting comment:', error.response?.data || error.message);
    throw error;
  }
};

// export const editComment = async ({ postId, commentId, updatedText }) => {
//   const res = await axiosInstance.put(
//     `/api/posts/comment/edit/${postId}/${commentId}`,
//     { text: updatedText }
//   );
//   return res.data;
// };



export const editComment = async ({ postId, commentId, updatedText }) => {
  try {
    console.log(" Sending edit comment request");
    console.log(" postId:", postId);
    console.log(" commentId:", commentId);
    console.log(" updatedText:", updatedText);

    const response = await axiosInstance.put(
      `/api/posts/comment/edit/${postId}/${commentId}`,
      { text: updatedText }
    );

    console.log(" Edit comment response:", response.data);
    return response.data;

  } catch (error) {
    console.error(" Failed to edit comment:", error.response?.data || error.message);
    throw error;
  }
};




export const updatePost = async ({ postId, updatedData }) => {
  try {
    const res = await axiosInstance.put(`/api/posts/update/${postId}`, updatedData);
    return res.data;
  } catch (error) {
    console.error('Error updating ost :', error.response?.data || error.message);
    throw error;
  }

};

