import apiClient from "../../apiClient";

export interface GstStateRow {
  id: number;
  code: string;
  name: string;
  igstEnabled: boolean;
  cgstSgstEnabled: boolean;
  hasSEZ: boolean;
  linkedStores: number;
  activeGstins: number;
  updatedAt: string;
  createdBy: string;
}

export interface GstStateStats {
  totalStates: number;
  activeGstins: number;
  igstEnabled: number;
  statesWithSEZ: number;
}

export interface LinkedStore {
  id: number;
  label: string;
}

export const getGstStates = async (): Promise<GstStateRow[]> => {
  const response = await apiClient.get("/api/gst-states");
      console.log("RAW API response:", response.data.data);

  return response.data.data;
};

export const getGstStateStats = async (): Promise<GstStateStats> => {
  const response = await apiClient.get("/api/gst-states/stats");
  return response.data.data;
};

export const getLinkedStores = async (stateId: string): Promise<LinkedStore[]> => {
  const response = await apiClient.get(`/api/gst-states/${stateId}/linked-stores`);
  return response.data.data;
};

// ── Toggle a single field (IGST / CGST+SGST) ───────────────────
export type GstStateToggleField = 'igst' | 'cgstSgst';

const FIELD_TO_API_KEY: Record<GstStateToggleField, string> = {
  igst: 'igstEnabled',        // matches PATCH /api/gst-states/[id] body -> updateGstState() input
  cgstSgst: 'cgstSgstEnabled',
};

export const updateGstStateField = async (
  id: number | string,
  field: GstStateToggleField,
  value: boolean
): Promise<GstStateRow> => {
  const response = await apiClient.patch(`/api/gst-states/${id}`, {
    [FIELD_TO_API_KEY[field]]: value,
  });
  return response.data.data;
};