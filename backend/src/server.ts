import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const CLIENT_PORT = process.env.CLIENT_PORT;

app.use(
  cors({
    origin: `http://localhost:${CLIENT_PORT}`,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "default-secret"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
