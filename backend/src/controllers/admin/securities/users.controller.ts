import { Request, Response } from "express";
import { usersService } from "../../../services/admin/securities/users.service.js";
import { AuthRequest } from "../../../middleware/auth.middleware.js";
import { audit } from "../../../utils/admin/securities/audit.utils.js";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const toIdOrNull = (v: unknown): number | null =>
  v === undefined || v === null || v === "" ? null : Number(v);

const handleError = (error: any, res: Response) => {
  if (error.code === "P2002")
    return res.status(409).json({ message: "Email already exists" });
  if (error.status)
    return res.status(error.status).json({ message: error.message });
  console.error(error);
  return res.status(500).json({ message: "Something went wrong" });
};

// ---------- LIST ----------
export const getUsers = async (req: Request, res: Response) => {
  try {
    const search =
      typeof req.query.search === "string" && req.query.search.trim()
        ? req.query.search.trim()
        : undefined;

    const [data, counts] = await Promise.all([
      usersService.list(search),
      usersService.counts(),
    ]);

    return res
      .status(200)
      .json({ message: "Users fetched successfully", data, counts });
  } catch (error) {
    return handleError(error, res);
  }
};

// ---------- GET ONE ----------
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const data = await usersService.getById(id);
    return res.status(200).json({ message: "User fetched successfully", data });
  } catch (error) {
    return handleError(error, res);
  }
};

// ---------- CREATE ----------
export const createUser = async (req: Request, res: Response) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(req.body.password ?? "");
    const roleId = Number(req.body.roleId);
    const organizationUnitId = toIdOrNull(req.body.organizationUnitId);
    const reportingManagerId = toIdOrNull(req.body.reportingManagerId);

    if (!name)
      return res.status(400).json({ message: "Full name is required" });
    if (!EMAIL_RE.test(email))
      return res.status(400).json({ message: "Valid email is required" });
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    if (!Number.isInteger(roleId) || roleId <= 0) {
      return res.status(400).json({ message: "Role is required" });
    }
    if (organizationUnitId !== null && !Number.isInteger(organizationUnitId)) {
      return res.status(400).json({ message: "Invalid org unit" });
    }
    if (reportingManagerId !== null && !Number.isInteger(reportingManagerId)) {
      return res.status(400).json({ message: "Invalid reporting manager" });
    }

    const data = await usersService.create(
      { name, email, password, roleId, organizationUnitId, reportingManagerId },
      (req as any).user.id,
    );
    await audit(
      req as AuthRequest,
      "SECURITIES",
      "USER_CREATED",
      `Created User ${name} (${email})`,
    );
    return res.status(201).json({ message: "User created successfully", data });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "SECURITIES",
      "USER_CREATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};

// ---------- UPDATE ----------
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "")
      .trim()
      .toLowerCase();
    const roleId = Number(req.body.roleId);
    const organizationUnitId = toIdOrNull(req.body.organizationUnitId);
    const reportingManagerId = toIdOrNull(req.body.reportingManagerId);

    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ message: "Invalid user id" });
    if (!name)
      return res.status(400).json({ message: "Full name is required" });
    if (!EMAIL_RE.test(email))
      return res.status(400).json({ message: "Valid email is required" });
    if (!Number.isInteger(roleId) || roleId <= 0) {
      return res.status(400).json({ message: "Role is required" });
    }
    if (organizationUnitId !== null && !Number.isInteger(organizationUnitId)) {
      return res.status(400).json({ message: "Invalid org unit" });
    }
    if (reportingManagerId !== null && !Number.isInteger(reportingManagerId)) {
      return res.status(400).json({ message: "Invalid reporting manager" });
    }

    const data = await usersService.update(
      id,
      { name, email, roleId, organizationUnitId, reportingManagerId },
      (req as any).user.id,
    );
    await audit(
      req as AuthRequest,
      "SECURITIES",
      "USER_UPDATED",
      `Updated User ${name} (${email}), ID ${id}`,
    );
    return res.status(200).json({ message: "User updated successfully", data });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "SECURITIES",
      "USER_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};

// ---------- ACTIVATE / DEACTIVATE ----------
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { isActive } = req.body;

    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ message: "Invalid user id" });
    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "isActive must be true or false" });
    }

    const data = await usersService.setActive(
      id,
      isActive,
      (req as any).user.id,
    );
    await audit(
      req as AuthRequest,
      "SECURITIES",
      isActive ? "USER_ACTIVATED" : "USER_DEACTIVATED",
      `${isActive ? "Activated" : "Deactivated"} User ID ${id}`,
    );
    return res.status(200).json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",
      data,
    });
  } catch (error) {
    await audit(
      req as AuthRequest,
      "SECURITIES",
      "USER_STATUS_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unknown error",
      "ERROR",
    );
    return handleError(error, res);
  }
};
