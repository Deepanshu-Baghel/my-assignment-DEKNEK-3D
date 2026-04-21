import http from "./http";

export const signupUser = async (payload) => {
  const { data } = await http.post("/auth/signup", payload);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await http.post("/auth/login", payload);
  return data;
};

export const logoutUser = async () => {
  const { data } = await http.post("/auth/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await http.get("/auth/me");
  return data;
};
