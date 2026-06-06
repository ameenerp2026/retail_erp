import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth/auth.routes.js'

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


const PORT = 5000;

app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`)
})