import { useQuery } from "@tanstack/react-query";
import { getFinanceData } from "@/services/admin/organization/finance.service";
import apiClient from "../../../services/apiClient";


export const useGetFinanceMonths = () => {
  return useQuery({
    queryKey: ["finance-months"],
    queryFn: getFinanceData,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });
};