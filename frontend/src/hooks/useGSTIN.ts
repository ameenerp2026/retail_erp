import { useQuery } from "@tanstack/react-query";
import { getGSTINs } from "../services/admin/organization/gstin.service";

export const useGSTINs = () => {
  return useQuery({
    queryKey: ["gstins"],
    queryFn: getGSTINs,
    staleTime: 5 * 60 * 1000,
  });
};