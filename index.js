import express from "express";
import { scanAvailableDevices } from "./scanDevices.js";

// Initialize Express
const app = express();

const activeUsers = {
  "F4:7D:EF:57:50:F3": { username: "ikozul00", isProfesor: false },
  "E0:AA:96:BB:17:5F": { username: "sgotovac", isProfesor: true },
  "1C:E6:1D:5C:03:BC": { username: "mmucic00", isProfesor: false },
};

var intervalID;

const startScanning = () => {
  intervalID = setInterval(scanAvailableDevices, 10000, activeUsers);
};

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

startScanning();

// Export the Express API
export default app;
