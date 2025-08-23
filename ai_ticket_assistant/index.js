import express from "express";
import mongoose from "mongoose";
import cors from 'cors'
import { config } from 'dotenv';
import userRoute from "./routes/user"

config();
const PORT = process.env.PORT || 3000
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', userRoute)

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Mondo DB connected")
        app.listen(PORT, () => {
            console.log("Server is at:", PORT)
        })
    })
    .catch((error) => {
        console.log("Mongo DB error", error)
    })
