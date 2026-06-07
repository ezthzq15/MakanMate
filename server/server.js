require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");
const { addTimestamp, logger, errorHandler } = require("./src/middlewares");

const app = express();

// ── CORS — allow Firebase Hosting + localhost dev ──────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://makanmate-dda94.web.app',
  'https://makanmate-dda94.firebaseapp.com',
  // Add any custom domain here, e.g. 'https://www.makanmate.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin} is not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Global middlewares from ptpiconnect-dev port
app.use(addTimestamp);
app.use(logger);

app.use("/api", routes);

// Error handling middleware matches ptpiconnect-dev pattern
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});