import { Request, Response } from "express";
import * as accountGroupService from "../../../services/admin/finance/AccountGroup.service.js";

/**
 * Get all groups
 */
export const getGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groups = await accountGroupService.getGroups();

    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch groups",
    });
  }
};

/**
 * Get sub groups by group id
 */
export const getSubGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const groupId = Number(req.params.groupId);

    const subGroups = await accountGroupService.getSubGroups(groupId);

    res.status(200).json({
      success: true,
      data: subGroups,
    });
  } catch (error) {
    console.error("Error fetching sub groups:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sub groups",
    });
  }
};

/**
 * Get all account groups
 */
export const getAccountGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await accountGroupService.getAccountGroups();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch account groups",
    });
  }
};

/**
 * Get account group by id
 */
export const getAccountGroupById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const data = await accountGroupService.getAccountGroupById(id);

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Account Group not found",
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
      message: "Failed to fetch account group",
    });
  }
};

/**
 * Create account group
 */
export const createAccountGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.id; // was .id — now matches the JWT payload
    console.log('req.user:', (req as any).user);
    console.log('userId being passed:', userId);

    const data = await accountGroupService.createAccountGroup(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Account Group created successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create account group",
    });
  }
};

/**
 * Update account group
 */
export const updateAccountGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    const data = await accountGroupService.updateAccountGroup(id, req.body);

    res.status(200).json({
      success: true,
      message: "Account Group updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update account group",
    });
  }
};

/**
 * Delete account group (Soft Delete)
 */
export const deleteAccountGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    await accountGroupService.deleteAccountGroup(id);

    res.status(200).json({
      success: true,
      message: "Account Group deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete account group",
    });
  }
};

/**
 * Get active account groups
 */
export const getActiveAccountGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await accountGroupService.activeAccountGroups();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch active account groups",
    });
  }
};