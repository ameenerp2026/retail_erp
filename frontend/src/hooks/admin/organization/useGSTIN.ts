import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGSTIN,getGSTINs } from "../../../services/admin/organization/gstin.service";

export const useGSTINs = () => {
  return useQuery({
    queryKey: ["gstins"],
    queryFn: getGSTINs,
    staleTime: 5 * 60 * 1000,
  });
};


export const useCreateGSTIN = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGSTIN,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gstins"],
      });
    },
  });
};