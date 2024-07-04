import { app } from "./app.js";
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { setupWebSocket } from "./ws/websocket.js";

dotenv.config({
    path: './.env'
})

const PORT = process.env.PORT || 8000

connectDB()
.then(() =>{
    const server = app.listen(PORT, () =>{
        console.log(`Server is running on port ${PORT}`);
    });
    setupWebSocket(server);
})
.catch((err) =>{
    console.log("MongoDB connection error",err);
})

