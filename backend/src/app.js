import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routers/user.route.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

// routes
app.use('/api/v1/users/uploads', express.static(`${__dirname}/./uploads`))
app.use('/api/v1/users', userRouter)



export {app}