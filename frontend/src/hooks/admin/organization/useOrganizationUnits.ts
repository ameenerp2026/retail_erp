// hooks/useOrganizationUnits.ts

import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../services/apiClient";

export const useOrganizationUnits = () => {
  return useQuery({
    queryKey: ["organization-units"],
    queryFn: async () => {
      const res = await apiClient.get("/api/organizationUnit/org-unit");
      console.log('useOrganizationUnits',res.data.data)
      return res.data.data;
    },
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });
};