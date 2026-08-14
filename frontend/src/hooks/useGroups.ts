import { useQuery } from "@tanstack/react-query";
import { accountGroupService } from "@/services/admin/finance/accountGroupService";

export const useGroups = () => {
  return useQuery({
    queryKey: ["groups"],
    queryFn: accountGroupService.getGroups,
  });
};
export const useActiveAccountGroups = () => {
  return useQuery({
    queryKey: ["active-groups"],
    queryFn: accountGroupService.getActiveGroups,
  });
};