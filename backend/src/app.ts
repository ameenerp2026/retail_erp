import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth/auth.routes.js";
import organizationRoutes from "./routes/admin/organization/organization.routes.js";
import organizationUnit from "./routes/admin/organization/organizationUnit.routes.js";
import financeMonth from "./routes/admin/organization/financeMonth.routes.js";
import accountingYear from "./routes/admin/organization/accountingYear.routes.js";
import gstInManagement from "./routes/admin/organization/GSTINManagement.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ERP backend running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/organizationUnit", organizationUnit);
app.use("/api/financeMonth", financeMonth);
app.use("/api/accountingYear", accountingYear);
app.use("/api/gstManagement", gstInManagement);

export default app;