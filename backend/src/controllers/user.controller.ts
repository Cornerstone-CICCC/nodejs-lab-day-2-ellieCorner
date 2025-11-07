import { Request, Response } from "express";
import { UserModel } from "../models/user.model";

export const getUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const username = req.session?.username;

    if (!username) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const user = UserModel.findByUsername(username);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const user = await UserModel.login(username, password);

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
      return;
    }

    req.session = { username: user.username };

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Login successful", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password, firstname, lastname } = req.body;

    if (!username || !password || !firstname || !lastname) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = UserModel.findByUsername(username);
    if (existingUser) {
      res.status(409).json({ message: "Username already exists" });
      return;
    }

    const newUser = await UserModel.create({
      username,
      password,
      firstname,
      lastname,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (req: Request, res: Response): void => {
  try {
    req.session = null;
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
