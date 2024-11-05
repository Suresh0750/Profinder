import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors'
import morgan from "morgan";
import session from 'express-session'
import bodyParser  from 'body-parser'
import http,{createServer} from 'http'
import { Server as serverSocket } from "socket.io"


// * database connection
import { connectDB } from "./infrastructure/config/database.config";

// * routers
import userRouter from "./Presentation/http/routes/userRoutes";
import adminRouter from "./Presentation/http/routes/adminRoutes"
import customerRouter from './Presentation/http/routes/customerRouter'
import { errorHandles } from "./Presentation/http/middlewares/errorHandler";
import workerRouter from './Presentation/http/routes/workerRouter'


// * socket
import {socketHandler} from './infrastructure/service/socket/chat'

const app = express();

// * session configuration

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({ extended: false }))  

dotenv.config(); // * config the dotenv for accessing the value inside the file.

app.use(express.json()); //* using for parse the body data in json format
app.use(cookieParser()); // * cookie parser use to access the cookie from client side


app.use(morgan("dev")); // *

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});
const allowedOrigins = [
  "http://profinders.online",  
  "http://localhost:3000",
  "https://test.payu.in", 
];

const corsOptions = {
  origin: allowedOrigins, 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Role'],
  credentials: true // * Allows cookies and other credentials to be shared
};

app.use(cors(corsOptions)); // Ensure this is before your routes

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// * application layer

app.use("/v1/api/user", userRouter);
app.use('/v1/api/customer',customerRouter)
app.use("/v1/api/admin",adminRouter)
app.use("/v1/api/worker",workerRouter)



// * Error handle middleware
app.use(errorHandles);

const PORT = process.env.PORT || 3002;  

const httpServer = createServer(app)

export const io=new serverSocket(httpServer,{
  cors :{
    origin: allowedOrigins,
    methods:  ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']
  }
})

socketHandler(io)

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`server running on \n http://localhost:${PORT}`);
  });
});
