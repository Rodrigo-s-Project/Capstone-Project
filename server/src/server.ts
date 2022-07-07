import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.set("port", process.env.PORT);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
  })
);

// Routes
import mainRoutes from "./routes/main.routes";
import authRoutes from "./routes/auth.routes";
import companyDashboardRoutes from "./routes/dashboard.company.routes";
import teamDashboardRoutes from "./routes/dashboard.team.routes";
app.use("/", mainRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard/company", companyDashboardRoutes);
app.use("/dashboard/team", teamDashboardRoutes);

app.use(express.json());
