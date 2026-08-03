import apiClient from "@/services/apiClient";

export const getOrganizationUnits = async () => {
  const res = await apiClient.get("/api/organizationUnit/org-unit");
  return res.data.data;
};