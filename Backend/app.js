const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();

// CORS CONFIGURATION
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
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ROUTES
const routes = require("./route/routes");
app.use("/api", routes);

module.exports = app;
