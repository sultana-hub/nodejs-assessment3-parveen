export const baseUrl = "http://localhost:5000/";

export const endPoints = {
  register: "api/auth/register",
  login: "api/auth/login",
  profiles: "api/profile/",
  profileById: "api/profile/user/",
  createProfile: "api/profile/create",
  editProfile: "api/profile/update",
  currentProfile: "api/profile/me",
  addExperience: "api/profile/experience",
  deleteExperience: "api/profile/experience/delete/",
  addEducation: "api/profile/education",
  deleteEducation: "api/profile/education/delete/",
  deleteProfileAndUser: "api/profile/delete",
  createPost: "api/posts/create",
  getAllPosts: "api/posts/allPosts",
  getPostById: "api/posts/",
  deletePost: "api/posts/delete/",
  updatePost: "api/posts/update/",
  likePost: "api/posts/like/",
  unlikePost: "api/posts/unlike/",
  createcomment: "api/posts/comment/post/",
  getComments: "api/posts/comments/post/",
  deleteComment: "api/posts/delete-comment/",
  editComment:"api/posts/comment/edit",
  otpEmailVerify:"api/auth/verify/email",
  resendOtp:"api/auth/resend/otp"
};
