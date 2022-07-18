import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

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
import controlsDashboardRoutes from "./routes/dashboard.controls.routes";
import calendarRoutes from "./routes/calendar.routes";
import driveRoutes from "./routes/drive.routes";
import profileRoutes from "./routes/user.routes";
app.use("/", mainRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard/company", companyDashboardRoutes);
app.use("/dashboard/team", teamDashboardRoutes);
app.use("/dashboard/controls", controlsDashboardRoutes);
app.use("/dashboard/calendar", calendarRoutes);
app.use("/dashboard/drive", driveRoutes);
app.use("/profile", profileRoutes);

// Static
app.use("/public", express.static(path.join(__dirname, "public")));
