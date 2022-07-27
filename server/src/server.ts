import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";

export const app = express();

export const server = http.createServer(app);
export const io = require("socket.io")(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true
  }
});

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
import chatRoutes from "./routes/chat.routes";
app.use("/", mainRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard/company", companyDashboardRoutes);
app.use("/dashboard/team", teamDashboardRoutes);
app.use("/dashboard/controls", controlsDashboardRoutes);
app.use("/dashboard/calendar", calendarRoutes);
app.use("/dashboard/drive", driveRoutes);
app.use("/profile", profileRoutes);
app.use("/chat", chatRoutes);

// Static
app.use("/public", express.static(path.join(__dirname, "public")));

// Socket Io
import { manageSocketChat } from "./sockets/chat/index";

// Here I create my Hash Map
// It is important to have it as "var"
// Because I want it as a global variable
var SOCKET_LIST: Object = {};

io.on("connection", (socket: any) => {
  // Every time a user connects
  // This function gets a socket object
  // The id of this socket is always unique
  // So we call the function of manageSocketsChat()
  manageSocketChat(socket, SOCKET_LIST);
});
