import http from "./http";

export const fetchTasks = async () => {
  const { data } = await http.get("/tasks");
  return data;
};

export const createTask = async (payload) => {
  const { data } = await http.post("/tasks", payload);
  return data;
};

export const updateTask = async (taskId, payload) => {
  const { data } = await http.put(`/tasks/${taskId}`, payload);
  return data;
};

export const deleteTask = async (taskId) => {
  const { data } = await http.delete(`/tasks/${taskId}`);
  return data;
};
