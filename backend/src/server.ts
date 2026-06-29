import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth/auth.routes.js'
import organizationRoutes from './routes/admin/organization/organization.routes.js'
import organizationUnit from './routes/admin/organization/organizationUnit.routes.js'
import financeMonth from './routes/admin/organization/financeMonth.router.js'
const app = express();

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.json({
        message: 'ERP backend runningq'
    })
})
app.get("/", (req, res) => {
  res.send("Backend running");
});
app.use('/api/auth',authRoutes) 
app.use("/api/organization", organizationRoutes);
app.use("/api/organizationUnit", organizationUnit);
app.use('/api/financeMonth',financeMonth)


const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})