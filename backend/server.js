import express from "express"
import authroutes from "./routes/auth.route.js"
import taskroutes from "./routes/task.route.js"
import mongoose from "mongoose";
import bodyParser from 'body-parser';
import cors from "cors"
const app = express();
app.use(
  cors({
    origin: "https://panscience-assignment-ten.vercel.app", 
    credentials: true,
  })
);
app.use(express.json())
import cookieParser from 'cookie-parser';
app.use(cookieParser());

try{
await mongoose.connect("mongodb+srv://vashista:60DOtY1My8agSgdx@vista.fmo7sqp.mongodb.net/resumeuser?retryWrites=true&w=majority&appName=vista")
        console.log("mongodb conencted successfully")
    }catch(error){
        console.log(error)
    }

app.listen(5000,()=>{
  console.log("server listening on 5000")
})

app.use("/api/auth", authroutes);
app.use("/api/task", taskroutes);