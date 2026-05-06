import axiosClient from "./axiosClient";

export const getProjectsApi = async () => {
  const { data } = await axiosClient.get("/projects");
  return data;
};

export const getProjectByIdApi = async (projectId) => {
  const { data } = await axiosClient.get(`/projects/${projectId}`);
  return data;
};

export const createProjectApi = async (payload) => {
  const { data } = await axiosClient.post("/projects", payload);
  return data;
};

export const updateProjectApi = async (projectId, payload) => {
  const { data } = await axiosClient.put(`/projects/${projectId}`, payload);
  return data;
};

export const addProjectMembersApi = async (projectId, memberIds) => {
  const { data } = await axiosClient.post(`/projects/${projectId}/members`, { memberIds });
  return data;
};

export const removeProjectMembersApi = async (projectId, memberIds) => {
  const { data } = await axiosClient.delete(`/projects/${projectId}/members`, {
    data: { memberIds },
  });
  return data;
};
