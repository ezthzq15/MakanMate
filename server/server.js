require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");
const { addTimestamp, logger, errorHandler } = require("./src/middlewares");

const app = express();

// ── CORS — must be first, before any other middleware ──────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://makanmate-dda94.web.app',
  'https://makanmate-dda94.firebaseapp.com',
  'https://makanmate-api.onrender.com',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // silently reject instead of throwing — avoids 500 errors
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

// Global middlewares
app.use(addTimestamp);
app.use(logger);

app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});