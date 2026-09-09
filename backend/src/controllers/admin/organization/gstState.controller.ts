import { Request, Response } from "express";
import {
  getGstStateTable,
  getGstStateStats,
  getGstStateOptions,
  getGstStateById,
  getLinkedStoresByState as fetchLinkedStores,
  updateGstState,
} from "../../../services/admin/organization/gstState.service.js";


export async function getGstStateTableHandler(req: Request, res: Response) {
  try {
    const rows = await getGstStateTable();
    res.status(200).json({ data: rows });
  } catch (err) {
    console.error("[gstState.controller] getGstStateTableHandler failed:", err);
    res.status(500).json({ error: "Failed to fetch GST state details." });
  }
}

export async function getGstStateStatsHandler(req: Request, res: Response) {
  try {
    const stats = await getGstStateStats();
    res.status(200).json({ data: stats });
  } catch (err) {
    console.error("[gstState.controller] getGstStateStatsHandler failed:", err);
    res.status(500).json({ error: "Failed to fetch GST state stats." });
  }
}

// Lightweight list for dropdowns (id, code, isoCode, name only)
export async function getGstStateOptionsHandler(req: Request, res: Response) {
  try {
    const options = await getGstStateOptions();
    res.status(200).json({ data: options });
  } catch (err) {
    console.error("[gstState.controller] getGstStateOptionsHandler failed:", err);
    res.status(500).json({ error: "Failed to fetch GST state options." });
  }
}

// Used by the per-state edit view to load current toggle values
export async function getGstStateByIdHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid state id." });
    }

    const state = await getGstStateById(id);

    if (!state) {
      return res.status(404).json({ error: "GST state not found." });
    }

    res.status(200).json({ data: state });
  } catch (err) {
    console.error("[gstState.controller] getGstStateByIdHandler failed:", err);
    res.status(500).json({ error: "Failed to fetch GST state." });
  }
}
// Used by the per-state edit view to load linked stores
export async function getLinkedStoresByState(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid state id." });
    }

    const linkedStores = await fetchLinkedStores(id);
    res.status(200).json({ data: linkedStores });
  } catch (err) {
    console.error("[gstState.controller] getLinkedStoresByState failed:", err);
    res.status(500).json({ error: "Failed to fetch linked stores." });
  }
}

// Saves toggle changes from the edit view
export async function updateGstStateHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid state id." });
    }

    // req.user assumed to be set by your auth middleware — adjust
    // to however the authenticated user is actually attached on
    // your req object.
    const updatedById = (req as any).user?.id;
    if (!updatedById) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    const { igstEnabled, cgstSgstEnabled, hasSEZ } = req.body;

    const updated = await updateGstState(id, {
      igstEnabled,
      cgstSgstEnabled,
      updatedById,
    });

    res.status(200).json({ data: updated });
  } catch (err) {
    console.error("[gstState.controller] updateGstStateHandler failed:", err);
    res.status(500).json({ error: "Failed to update GST state." });
  }
}