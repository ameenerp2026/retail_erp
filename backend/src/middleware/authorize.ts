import { Response, NextFunction } from "express";
import prisma from "../config/prisma.js";
import { AuthRequest } from "./auth.middleware.js";

export const authorize = (requiredPermission: string) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {


            console.log("========== AUTHORIZE DEBUG ==========");
      console.log("Required permission:", requiredPermission);
      console.log("User:", req.user);
      
      if (!req.user) {
        res.status(401).json({
          message: "Authentication required",
        });
        return;
      }

      // 2. Find user's roles and permissions
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
    console.log("User roles count:", userRoles.length);

      console.log(
        "USER ROLES:",
        userRoles.map((userRole) => ({
          roleId: userRole.role.id,
          roleName: userRole.role.name,
          permissions: userRole.role.rolePermissions.map(
            (rolePermission) => rolePermission.permission.code
          ),
        }))
      );
      // 3. Check whether any role contains required permission
      const hasPermission = userRoles.some((userRole) =>
        userRole.role.rolePermissions.some(
          (rolePermission) =>
            rolePermission.permission.code === requiredPermission
        )
      );
    console.log("Has required permission:", hasPermission);
      // 4. Permission not found
      if (!hasPermission) {
        res.status(403).json({
          message: "Forbidden",
          requiredPermission,
        });
        return;
      }
    console.log("✅ Permission allowed");
      console.log("====================================");
      // 5. Permission exists
      next();
    } catch (error) {
      console.error("Authorization error:", error);

      res.status(500).json({
        message: "Authorization check failed",
      });
    }
  };
};