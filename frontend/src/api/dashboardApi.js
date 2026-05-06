import axiosClient from "./axiosClient";

export const getDashboardStatsApi = async (params = {}) => {
  const { data } = await axiosClient.get("/dashboard", { params });
  return data;
};
