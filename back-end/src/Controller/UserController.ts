import express = require("express");
var jwt = require("jsonwebtoken");

type Request = express.Request;
type Response = express.Response;

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

// getProfile
const getProfile = async (req: Request, res: Response): Promise<any> => {
  const token = req.cookies.accessToken;
  if (!token) return res.sendStatus(401);

  try {
    const data = jwt.verify(token, ACCESS_SECRET);
    res.json({ user: data });
  } catch {
    res.sendStatus(403);
  }
};

module.exports = {
  getProfile,
};
