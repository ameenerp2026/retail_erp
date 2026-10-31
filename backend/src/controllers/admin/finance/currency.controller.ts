// controllers/admin/finance/currency.controller.ts
import { Request, Response } from "express";
import { currencyService } from "../../../services/admin/finance/Currency.service.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { createAuditLog } from "../../../services/admin/userLogs.service.js";

const logCurrencyAction = async (
  req: Request,
  action: string,
  description: string,
  level: "SUCCESS" | "ERROR" | "WARNING" | "INFO" = "SUCCESS",
): Promise<void> => {
  try {
    const user = (req as AuthRequest).user;
    await createAuditLog({
      action,
      level,
      module: "Currency",
      userId: user?.id ?? null,
      userName: user?.email ?? null,
      description,
      ipAddress: req.ip,
    });
  } catch (error) {
    console.error("Failed to create currency audit log", error);
  }
};

export const getCurrenciesHandler = async (req: Request, res: Response) => {
  try {
    const data = await currencyService.getCurrencies();
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

function validateBody(body: any) {
  if (!body.code?.trim()) {
    return { field: "code", message: "Currency code is required" };
  }
  if (!body.name?.trim()) {
    return { field: "name", message: "Currency name is required" };
  }
  if (!body.symbol?.trim()) {
    return { field: "symbol", message: "Symbol is required" };
  }
  if (
    body.exchangeRate === undefined ||
    body.exchangeRate === null ||
    Number.isNaN(Number(body.exchangeRate))
  ) {
    return { field: "exchangeRate", message: "Exchange rate is required" };
  }
  if (Number(body.exchangeRate) <= 0) {
    return {
      field: "exchangeRate",
      message: "Exchange rate must be greater than 0",
    };
  }
  return null;
}

export const createCurrencyHandler = async (req: Request, res: Response) => {
  const validationError = validateBody(req.body);
  if (validationError) {
    return res
      .status(422)
      .json({ errors: { [validationError.field]: [validationError.message] } });
  }

  try {
    const userId = (req as any).user?.id;
    const data = await currencyService.createCurrency(req.body, userId);
    await logCurrencyAction(req,
      'CREATED CURRENCY',
      `Currency created: ${data.currencyCode}`,
      'SUCCESS'
    )

    return res.status(201).json({
      success: true, message: "Currency added successfully", data
    });
  }
  catch (err: any) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ errors: { code: ["This currency code already exists"] } });
    }
    console.error(err);
    await logCurrencyAction(
      req,
      "Currency",
      `Failed to create currency: ${err instanceof Error ? err.message : "Unknown error"
      }`,
      "ERROR"
    );

    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const updateCurrencyHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid currency id" });
  }

  const validationError = validateBody(req.body);
  if (validationError) {
    return res
      .status(422)
      .json({ errors: { [validationError.field]: [validationError.message] } });
  }

  try {
    const userId = (req as any).user?.id;
    const data = await currencyService.updateCurrency(id, req.body, userId);
    await logCurrencyAction(req,
      'UPDATED CURRENCY',
      `Currency updated: ${data.currencyCode}`,
      'SUCCESS'
    )

    return res
      .status(200)
      .json({ success: true, message: "Currency updated successfully", data });
  } catch (err: any) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ error: "Currency not found" });
    }
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ errors: { code: ["This currency code already exists"] } });
    }
    console.error(err);
    await logCurrencyAction(
      req,
      'Currency',
      `Failed to update currency ID ${id}: ${err instanceof Error ? err.message : 'Unknown error'
      }`,
      'ERROR'
    );
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const deleteCurrencyHandler = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid currency id" });
  }

  try {
    const userId = (req as any).user?.id;
    await currencyService.deleteCurrency(id, userId);

    await logCurrencyAction(req,
      'DELETED CURRENCY',
      `Currency deleted: ID ${id}`,
      'SUCCESS'
    )

    return res
      .status(200)
      .json({ success: true, message: "Currency deleted successfully" });
  } catch (err: any) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ error: "Currency not found" });
    }
    if (err.code === "IS_BASE_CURRENCY" || err.code === "HAS_LINKED_LEDGERS") {
      return res.status(409).json({ error: err.message, code: err.code });
    }
    console.error(err);
    await logCurrencyAction(
      req,
      'Currency',
      `Failed to delete currency ID ${id}: ${err instanceof Error ? err.message : 'Unknown error'}`,
      'ERROR'
    )

    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const refreshCurrencyRateHandler = async (
  req: Request,
  res: Response,
) => {
  const id = Number(req.params.id);
  if (!id || Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid currency id" });
  }

  try {
    const userId = (req as any).user?.id;
    const data = await currencyService.refreshRate(id, userId);
    await logCurrencyAction(req,
      "REFRESHED CURRENCY RATE",
      `Currency rate refreshed: ID ${id}`,
      "SUCCESS"
    )

    return res
      .status(200)
      .json({ success: true, message: "Currency rate refreshed", data });
  } catch (err: any) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ error: "Currency not found" });
    }
    console.error(err);
    await logCurrencyAction(
      req,
      "REFRESH CURRENCY RATE",
      `Failed to refresh currency rate for ID ${id}: ${err instanceof Error ? err.message : "Unknown error"
      }`,
      "ERROR"
    );
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
