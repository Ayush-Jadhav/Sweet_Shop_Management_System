require("dotenv").config();
const app = require("./app");

// database connection
const connectWithDB = require("./config/connectDB");
connectWithDB();

// server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// worker start
const worker = require("./worker/orderProcessor");
worker.startWorker();
