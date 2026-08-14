import { Request, Response } from "express";
import {ledgerService} from "../../../services/admin/finance/Ledger.service.js";

//Function to create a new ledger
export const createLedgerHandler = async (req: Request, res: Response) => {
  const { ledgerName, accountGroupId, accountClassId, balanceType } = req.body;

  if (!ledgerName?.trim()) {
    return res.status(422).json({ errors: { ledgerName: ["Ledger Name is required"] } });
  }
  if (!accountGroupId) {
    return res.status(422).json({ errors: { accountGroupId: ["Account Group is required"] } });
  }
  if (!accountClassId) {
    return res.status(422).json({ errors: { accountClassId: ["Account Class is required"] } });
  }
  if (!balanceType) {
    return res.status(422).json({ errors: { balanceType: ["Balance Type is required"] } });
  }

  try {
    const userId = (req as any).user?.id;
    const data = await ledgerService.createLedger(req.body, userId);

    return res.status(201).json({
      success: true,
      message: "Ledger created successfully",
      data,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({
        errors: { ledgerName: ["This ledger name already exists in the selected account class"] },
      });
    }
    if (err.code === "P2003") {
      return res.status(422).json({
        error: "One of the selected references (Account Group, Account Class, Currency, or Org Unit) does not exist",
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Function to get all ledgers
export const getLedgersHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await ledgerService.getLedgers();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch ledgers",
    });
  }
};
// Function to get a ledger by ID
export const getLedgerByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const data = await ledgerService.getLedgerById(id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Ledger not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch ledger",
    });
  }
};
// Function to update a ledger
export const updateLedgerHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ledgerName, accountClassId, accountGroupId, balanceType, openingBalance, currencyId, organizationUnitId, gstApplicable, status } = req.body;

  if (!ledgerName?.trim()) {
    return res.status(422).json({
      errors: { ledgerName: ["Ledger Name is required"] },
    });
  }
  if (!accountGroupId) {
    return res.status(422).json({
      errors: { accountGroupId: ["Account Group is required"] },
    });
  }
  if (!accountClassId) {
    return res.status(422).json({
      errors: { accountClassId: ["Account Class is required"] },
    });
  }
  if (!balanceType) {
    return res.status(422).json({
      errors: { balanceType: ["Balance Type is required"] },
    });
  }
  try {
    const userId = (req as any).user?.id;
    const data = await ledgerService.updateLedger(
      Number(id),
      req.body,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Ledger updated successfully",
      data,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // record to update not found
      return res.status(404).json({ error: "Ledger not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({
        errors: { ledgerName: ["This ledger already exists"] },
      });
    }
    if (err.code === "P2003") {
      return res.status(422).json({
        errors: { accountGroupId: ["Selected Account Group does not exist"] },
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

// Function to delete a ledger (soft delete)
export const deleteLedgerHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid ledger id" });
  }
 
  try {
     const userId = (req as any).user?.id;
    await ledgerService.deleteLedger(id, userId);
    return res.status(200).json({ success: true, message: "Ledger deleted successfully" });
  } catch (err: any) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ error: "Ledger not found" });
    }
    if (err.code === "P2003") {
      return res.status(409).json({
        error: "Cannot delete this ledger — it has related records (e.g. sub-ledgers) depending on it.",
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};