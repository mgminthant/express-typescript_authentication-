var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var dotenv = require("dotenv");

const userRouter = require("./Routes/user");
const authRouter = require("./Routes/auth");

dotenv.config();

var app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

module.exports = app;

app.listen(PORT, () => console.log("Server running on port ", PORT));
