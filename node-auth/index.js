const express = require("express");
const connectDB = require("./db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const cors = require("cors");

const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_KEY],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  })
);
// cookie-parser middleware
app.use(cookieParser());

// Define authentication routes
app.use("/auth", authRoutes);

// Define user routes
app.use("/user", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
