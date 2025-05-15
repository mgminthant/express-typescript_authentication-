"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
const users = [];
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
function generateAccessToken(email) {
    return jsonwebtoken_1.default.sign({ email }, ACCESS_SECRET, { expiresIn: '15m' });
}
function generateRefreshToken(email) {
    return jsonwebtoken_1.default.sign({ email }, REFRESH_SECRET, { expiresIn: '7d' });
}
// Signup
app.post('/api/auth/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const hashed = yield bcryptjs_2.default.hash(password, 10);
    users.push({ email, password: hashed }); // BACKEND: Node.js + Express + TypeScript (JWT + Refresh Token)
    // 1. Install dependencies:
    // npm install express cors cookie-parser jsonwebtoken bcryptjs dotenv
    // npm install -D typescript @types/express @types/cookie-parser @types/jsonwebtoken @types/bcryptjs ts-node nodemon
    // 2. src/server.ts
    import express from 'express';
    import cors from 'cors';
    import cookieParser from 'cookie-parser';
    import dotenv from 'dotenv';
    import jwt from 'jsonwebtoken';
    import bcrypt from 'bcryptjs';
    dotenv_2.default.config();
    const app = (0, express_2.default)();
    app.use(express_2.default.json());
    app.use((0, cookie_parser_2.default)());
    app.use((0, cors_2.default)({ origin: 'http://localhost:5173', credentials: true }));
    const users = [];
    const ACCESS_SECRET = process.env.ACCESS_SECRET || 'access_secret';
    const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';
    function generateAccessToken(email) {
        return jsonwebtoken_2.default.sign({ email }, ACCESS_SECRET, { expiresIn: '15m' });
    }
    function generateRefreshToken(email) {
        return jsonwebtoken_2.default.sign({ email }, REFRESH_SECRET, { expiresIn: '7d' });
    }
    // Signup
    app.post('/api/auth/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const hashed = yield bcryptjs_2.default.hash(password, 10);
        users.push({ email, password: hashed });
        res.sendStatus(201);
    }));
    // Login
    app.post('/api/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        if (!user || !(yield bcryptjs_2.default.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const accessToken = generateAccessToken(user.email);
        const refreshToken = generateRefreshToken(user.email);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ message: 'Logged in' });
    }));
    // Profile (protected route)
    app.get('/api/user', (req, res) => {
        const token = req.cookies.accessToken;
        if (!token)
            return res.sendStatus(401);
        try {
            const data = jsonwebtoken_2.default.verify(token, ACCESS_SECRET);
            res.json({ user: data });
        }
        catch (_a) {
            res.sendStatus(403);
        }
    });
    // Refresh Token
    app.post('/api/auth/refresh', (req, res) => {
        const token = req.cookies.refreshToken;
        if (!token)
            return res.sendStatus(401);
        try {
            const data = jsonwebtoken_2.default.verify(token, REFRESH_SECRET);
            const newAccess = generateAccessToken(data.email);
            res.cookie('accessToken', newAccess, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000,
            });
            res.json({ message: 'Refreshed' });
        }
        catch (_a) {
            res.sendStatus(403);
        }
    });
    // Logout
    app.post('/api/auth/logout', (_req, res) => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.sendStatus(200);
    });
    app.listen(5000, () => console.log('Server running on port 5000'));
    // 3. .env file:
    // ACCESS_SECRET=your_access_token_secret
    // REFRESH_SECRET=your_refresh_token_secret
    res.sendStatus(201);
}));
// Login
app.post('/api/auth/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ message: 'Logged in' });
}));
// Profile (protected route)
app.get('/api/user', (req, res) => {
    const token = req.cookies.accessToken;
    if (!token)
        return res.sendStatus(401);
    try {
        const data = jsonwebtoken_1.default.verify(token, ACCESS_SECRET);
        res.json({ user: data });
    }
    catch (_a) {
        res.sendStatus(403);
    }
});
// Refresh Token
app.post('/api/auth/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.sendStatus(401);
    try {
        const data = jsonwebtoken_1.default.verify(token, REFRESH_SECRET);
        const newAccess = generateAccessToken(data.email);
        res.cookie('accessToken', newAccess, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.json({ message: 'Refreshed' });
    }
    catch (_a) {
        res.sendStatus(403);
    }
});
// Logout
app.post('/api/auth/logout', (_req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.sendStatus(200);
});
app.listen(5000, () => console.log('Server running on port 5000'));
// 3. .env file:
// ACCESS_SECRET=your_access_token_secret
// REFRESH_SECRET=your_refresh_token_secret
