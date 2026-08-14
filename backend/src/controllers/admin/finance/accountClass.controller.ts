import { Request, Response } from "express";
import * as accountClassService from "../../../services/admin/finance/AccountClass.service.js";
import {activeAccountGroups} from "../../../services/admin/finance/AccountGroup.service.js"

/**
 * POST /api/account-classes
 */
export const createAccountClassHandler = async (req: Request, res: Response) => {
  const { className, accountGroupId, description, status } = req.body;

  // basic validation
  if (!className?.trim()) {
    return res.status(422).json({
      errors: { className: ["Class Name is required"] },
    });
  }
  if (!accountGroupId) {
    return res.status(422).json({
      errors: { accountGroupId: ["Account Group is required"] },
    });
  }

  try {
        const userId = (req as any).user?.id;
        const data = await accountClassService.createAccountClass(req.body, userId);

    return res.status(201).json({
      success: true,
      message: "Account Class created successfully",
      data,
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      // unique constraint violation (className + accountGroupId)
      return res.status(409).json({
        errors: { className: ["This class already exists in the selected group"] },
      });
    }
    if (err.code === "P2003") {
      // FK violation - accountGroupId doesn't exist
      return res.status(422).json({
        errors: { accountGroupId: ["Selected Account Group does not exist"] },
      });
    }
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

/**
 * GET /api/account-groups/active
 * (for populating the dropdown in the modal)
 */
export const getActiveAccountGroupsHandler = async (_req: Request, res: Response) => {
  try {
    const groups = await activeAccountGroups();
    return res.status(200).json({ data: groups });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch account groups" });
  }
};

export const getAccountClassesHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await accountClassService.getAccountClasses();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch account classes",
    });
  }
};
/**
 * Get account class by id
 */
export const getAccountClassByIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const data = await accountClassService.getAccountClassById(id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Account Class not found",
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
      message: "Failed to fetch account class",
    });
  }
};

/**
 * Update account class
 */
// controllers/admin/accountClass.controller.ts
export const updateAccountClassHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { className, accountGroupId, description, status } = req.body;

  if (!className?.trim()) {
    return res.status(422).json({
      errors: { className: ["Class Name is required"] },
    });
  }
  if (!accountGroupId) {
    return res.status(422).json({
      errors: { accountGroupId: ["Account Group is required"] },
    });
  }

  try {
    const userId = (req as any).user?.id;
    const data = await accountClassService.updateAccountClass(
      Number(id),
      req.body,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Account Class updated successfully",
      data,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      // record to update not found
      return res.status(404).json({ error: "Account Class not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({
        errors: { className: ["This class already exists in the selected group"] },
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

/**
 * Delete account class (Soft Delete)
 */
export const deleteAccountClassHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const userId = (req as any).user?.id;
    await accountClassService.deleteAccountClass(Number(id));

    return res.status(200).json({
      success: true,
      message: "Account Class deleted successfully",
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Account Class not found" });
    }
    console.error(err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};
//account class by group id
export const getAccountClassesByGroupHandler = async (req: Request, res: Response) => {
  const { accountGroupId } = req.params;

  try {
    const data = await accountClassService.getAccountClassesByGroup(Number(accountGroupId));
    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch account classes" });
  }
};