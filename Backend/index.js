const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// DB
const connectWithDB = require("./config/connectDB");
connectWithDB();

const allowedOrigins = [
  "https://sweet-shop-management-system-one-mu.vercel.app",
  "https://sweet-shop-management-system-ayush-jadhavs-projects-325ccd82.vercel.app",
  "https://sweet-shop-management-system-oigbpgtbo.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS blocked request from origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// middleware for deal with file-upload
const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

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
