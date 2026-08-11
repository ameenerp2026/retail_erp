import apiClient from "../../apiClient";

export const getGSTINs = async () => {
  const response = await apiClient.get("/api/gstManagement/gst");
  return response.data.data;
};