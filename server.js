// modules
const path = require("path");
const express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

const PORT = process.env.PORT || 5000;

// database connection
const connectDB = require("./config/db.js");

dotenv.config();
connectDB();

// Error handler
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");

// Routes
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running....");
});

//   Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
