export const getToken = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
  
    return token && `Bearer ${token}`;
  };
  
  export const getBearToken = () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
  
    return token;
  };
  
  export const removeToken = () => {
    localStorage?.removeItem("token");
  };
  
  export const setToken = async (token: string) => {
    localStorage.setItem("token", token);
  };
    