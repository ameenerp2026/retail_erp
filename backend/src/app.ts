import express from "express";
import cors from "cors";

import authRoutes from './routes/auth/auth.routes.js'
import organizationRoutes from './routes/admin/organization/organization.routes.js'
import organizationUnit from './routes/admin/organization/organizationUnit.routes.js'
import financeMonth from './routes/admin/organization/financeMonth.routes.js'
import gstInManagement from './routes/admin/organization/GSTINManagement.routes.js'
import businessLocation from './routes/admin/organization/BusinessLocation.routes.js'
import accountingYear from './routes/admin/organization/accountingYear.routes.js'
import accountGroup from './routes/admin/finance/accountGroup.routes.js'
import accountClassRoutes from './routes/admin/finance/accountClass.routes.js'
import ledgerRoutes from './routes/admin/finance/ledger.route.js'
import subLedgerRoutes from './routes/admin/finance/subLedger.routes.js'
import currencyRoutes from "./routes/admin/finance/currency.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ERP backend running",
  });
});

app.use('/api/auth',authRoutes) 
app.use("/api/organization", organizationRoutes);
app.use("/api/organizationUnit", organizationUnit);
app.use('/api/financeMonth',financeMonth);
app.use("/api/gstManagement", gstInManagement);
app.use('/api/accountingYear',accountingYear)
app.use('/api/organization/businessLocation',businessLocation)
app.use('/api/finance/account-groups',accountGroup)
app.use('/api/finance/account-class',accountClassRoutes);
app.use('/api/finance/ledgers',ledgerRoutes);
app.use('/api/finance/sub-ledgers',subLedgerRoutes); 
app.use('/api/finance/currencies',currencyRoutes);


export default app;