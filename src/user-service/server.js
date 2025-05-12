require("dotenv").config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import passport from "passport";
import session from "express-session";
require("./config/passport");
const app = express();
const USER_SERVICE_PORT = process.env.USER_SERVICE_PORT || 8001;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://accounts.google.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

// Middleware to handle preflight requests
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // helps with CORS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware
app.use((req, res, next) => {
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // Route cho user service

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// Swagger UI

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(USER_SERVICE_PORT, () => {
  console.log(`User service is running on port ${USER_SERVICE_PORT}`);
 
});

export default app;