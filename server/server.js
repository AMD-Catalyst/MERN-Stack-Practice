require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3500;
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");

// connect to MongoDB
connectDB();

//route declaration
const employeeRouter = require("./routes/api/employees");
const rootRouter = require("./routes/root");
const registerRouter = require("./routes/register");
const authRouter = require("./routes/auth");
const refreshRouter = require("./routes/refresh");
const logoutRouter = require("./routes/logout");

//logger
app.use(logger);
//credentials
app.use(credentials);
//built-in middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//server static files
app.use("/", express.static(path.join(__dirname, "public")));

//routes
app.use("/", rootRouter);
app.use("/register", registerRouter);
app.use("/auth", authRouter);
app.use("/refresh", refreshRouter);
app.use("/logout", logoutRouter);
app.use(verifyJWT);
app.use("/employee", employeeRouter);

//404
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

//error Handler
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
});
