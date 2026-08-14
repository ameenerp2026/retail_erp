import apiClient from "../../apiClient";
import type { GstinFormData } from "@/components/forms/validate.schema";
export const getGSTINs = async () => {
  const response = await apiClient.get("/api/gstManagement/gst");
  return response.data.data;
};



export const createGSTIN=async(data:GstinFormData)=>{
  const response = await apiClient.post(
    "/api/gstManagement/gst",
 {
  gstin: data.gstin,
    state: data.state,
    organizationUnit: {
        connect: {
          id: Number(data.orgUnit),
        },
      },

      registrationType: data.type.toUpperCase(),

 }
  )
  return response.data
}