require("dotenv").config();
const express = require("express");
const cors = require("cors");

// const routes = require("./src/routes");
const testFirebase = require("./src/routes/testFirebase");

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/api", routes);
app.use("/api/test", testFirebase);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}`);
    console.log(`Server running on port http://localhost:${PORT}`);
});