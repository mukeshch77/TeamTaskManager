import axiosClient from "./axiosClient";

export const signupApi = async (payload) => {
  const { data } = await axiosClient.post("/auth/signup", payload);
  return data;
};

export const loginApi = async (payload) => {
  const { data } = await axiosClient.post("/auth/login", payload);
  return data;
};

export const meApi = async () => {
  const { data } = await axiosClient.get("/auth/me");
  return data;
};
