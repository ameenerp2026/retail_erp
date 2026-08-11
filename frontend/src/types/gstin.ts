import { StatusType } from "@/components/shared/StatusTags"
export type GstinStatusType = "Regular" | "Composition"

export type GSTINRecord = {
  id: string
  gstin: string
  state: string
   organizationUnitId: number;

  organizationUnit?: {
    id: number;
    organizationUnit: string;
  };

  type: GstinStatusType
  status: StatusType  // Verified, Pending, Failed
  lastVerified: string | null
}
