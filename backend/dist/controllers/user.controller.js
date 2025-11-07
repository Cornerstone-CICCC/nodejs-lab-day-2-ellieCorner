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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.addUser = exports.loginUser = exports.getUserByUsername = void 0;
const user_model_1 = require("../models/user.model");
const getUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const username = (_a = req.session) === null || _a === void 0 ? void 0 : _a.username;
        if (!username) {
            res.status(401).json({ message: "Not authenticated" });
            return;
        }
        const user = user_model_1.UserModel.findByUsername(username);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        // Return user data without password
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json(userWithoutPassword);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserByUsername = getUserByUsername;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: "Username and password are required" });
            return;
        }
        const user = yield user_model_1.UserModel.login(username, password);
        if (!user) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }
        req.session = { username: user.username };
        const { password: _ } = user, userWithoutPassword = __rest(user, ["password"]);
        res.json({ message: "Login successful", user: userWithoutPassword });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.loginUser = loginUser;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, firstname, lastname } = req.body;
        if (!username || !password || !firstname || !lastname) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        const existingUser = user_model_1.UserModel.findByUsername(username);
        if (existingUser) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }
        const newUser = yield user_model_1.UserModel.create({
            username,
            password,
            firstname,
            lastname,
        });
        const { password: _ } = newUser, userWithoutPassword = __rest(newUser, ["password"]);
        res.status(201).json({
            message: "User created successfully",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.addUser = addUser;
const logout = (req, res) => {
    try {
        req.session = null;
        res.json({ message: "Logout successful" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.logout = logout;
