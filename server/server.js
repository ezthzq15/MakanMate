require("dotenv").config();
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");
const { addTimestamp, logger, errorHandler } = require("./src/middlewares");

const app = express();

app.use(cors());
app.use(express.json());

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