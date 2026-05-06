import axiosClient from "./axiosClient";

export const getTasksApi = async (params = {}) => {
  const { data } = await axiosClient.get("/tasks", { params });
  return data;
};

export const getTaskByIdApi = async (taskId) => {
  const { data } = await axiosClient.get(`/tasks/${taskId}`);
  return data;
};

export const createTaskApi = async (payload) => {
  const { data } = await axiosClient.post("/tasks", payload);
  return data;
};

export const updateTaskApi = async (taskId, payload) => {
  const { data } = await axiosClient.put(`/tasks/${taskId}`, payload);
  return data;
};

export const deleteTaskApi = async (taskId) => {
  const { data } = await axiosClient.delete(`/tasks/${taskId}`);
  return data;
};
