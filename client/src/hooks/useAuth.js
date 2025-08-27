
const useAuth = () => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");
  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  return {
    token,
    userId,
  };
};

export default useAuth;