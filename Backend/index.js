const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// DB
const connectWithDB = require("./config/connectDB");
connectWithDB();


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

// middleware for deal with file-upload
const fileUpload = require("express-fileupload");
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

// Routes
const route = require("./route/routes");
app.use("/api", route);

// Server
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

// Worker
const worker = require("./worker/orderProcessor");
worker.startWorker();
