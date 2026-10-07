import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { getUserScopes } from "../utils/admin/securities/scope.helper.js";
import { canAccessScope } from "../utils/admin/securities/scope.authorization.js";
import prisma from "../config/prisma.js";


type ScopeSource = "params" | "body";

type ScopeOptions = {
  source: ScopeSource;
  field: string;
  resource: "organizationGroup" 
  | "organizationUnit"
  | "businessLocation";
};




export const requireScope = (options: ScopeOptions) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          message: "Authentication required",
        });
        return;
      }

      const data =
        options.source === "params"
          ? req.params
          : req.body;

      const id = Number(data[options.field]);

      if (!Number.isInteger(id)) {
        res.status(400).json({
          message: "Invalid scope resource ID",
        });
        return;
      }

   
let organizationGroupId: number;
let organizationUnitId: number | undefined;

if (options.resource === "organizationGroup") {
  const group = await prisma.organizationGroup.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!group) {
    res.status(404).json({
      message: "Organization Group not found",
    });
    return;
  }

  organizationGroupId = group.id;

} else if (options.resource === "organizationUnit") {
  const unit = await prisma.organizationUnit.findUnique({
    where: { id },
    select: {
      id: true,
      organizationGroupId: true,
    },
  });

  if (!unit) {
    res.status(404).json({
      message: "Organization Unit not found",
    });
    return;
  }

  organizationGroupId = unit.organizationGroupId;
  organizationUnitId = unit.id;

} else if (options.resource === "businessLocation") {
  const location = await prisma.businessLocation.findUnique({
    where: { id },
    select: {
      id: true,
      parentOrganizationUnit: {
        select: {
          id: true,
          organizationGroupId: true,
        },
      },
    },
  });

  if (!location) {
    res.status(404).json({
      message: "Business Location not found",
    });
    return;
  }

  organizationGroupId =
    location.parentOrganizationUnit.organizationGroupId;

  organizationUnitId =
    location.parentOrganizationUnit.id;
}

const scopes = await getUserScopes(req.user.id);
console.log("========== SCOPE DEBUG ==========");
console.log("Resource:", options.resource);
console.log("Resource ID:", id);
console.log("Organization Group ID:", organizationGroupId!);
console.log("Organization Unit ID:", organizationUnitId);
console.log("User ID:", req.user.id);
console.log("User Scopes:", scopes);
const allowed = canAccessScope(
  scopes,
  organizationGroupId!,
  organizationUnitId
);



console.log("Allowed:", allowed);
console.log("================================");

if (!allowed) {
  res.status(403).json({
    message: "Forbidden",
  });
  return;
}

next();
    } catch (error) {
      console.error("Scope authorization error:", error);

      res.status(500).json({
        message: "Scope authorization failed",
      });
    }
  };
};