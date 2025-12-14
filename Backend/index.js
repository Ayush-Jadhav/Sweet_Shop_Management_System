const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// DB
const connectWithDB = require("./config/connectDB");
connectWithDB();

/* 🔥 CORS MUST COME FIRST */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(express.json());
app.use(cookieParser());

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
