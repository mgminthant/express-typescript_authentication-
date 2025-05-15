import express = require("express");

var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

var { users } = require("../Services/AuthService");

type Request = express.Request;
type Response = express.Response;

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "refresh_secret";

function generateAccessToken(email: string) {
  return jwt.sign({ email }, ACCESS_SECRET, { expiresIn: "15m" });
}
function generateRefreshToken(email: string) {
  return jwt.sign({ email }, REFRESH_SECRET, { expiresIn: "7d" });
}

// Signup
const signUp = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  users.push({ email, password: hashed });
  res.json({message:"Singup Successful"});
  console.log(users);
};

//Login
const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const user = users.find(
    (u: { email: string; password: string }) => u.email === email
  );
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = generateAccessToken(user.email);
  const refreshToken = generateRefreshToken(user.email);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Logged in" });
};

//refreshToken
const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const data = jwt.verify(token, REFRESH_SECRET) as { email: string };
    const newAccess = generateAccessToken(data.email);
    res.cookie("accessToken", newAccess, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Refreshed" });
  } catch {
    res.sendStatus(403);
  }
};

//logout
const logout = (_req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendStatus(200);
};

module.exports = {
  signUp,
  login,
  refreshToken,
  logout,
};
