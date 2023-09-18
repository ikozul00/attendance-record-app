import express from "express";
import { scanAvailableDevices } from "./scanDevices.js";
import bodyParser from "body-parser";
import { updateAttendance } from "./updateAttendance.js";

// Initialize Express
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var intervalID;
var isScanningActive = false;

var activeUsers = {};

const startScanning = () => {
  console.log("start scanning");
  isScanningActive = true;
  intervalID = setInterval(triggerScan, 10000);
};

const triggerScan = () => {
  scanAvailableDevices(activeUsers);
};

const findAddress = (username) => {
  if (username === "sgotovac") {
    return "E0:AA:96:BB:17:5F";
  }
  if (username === "ikozul00") {
    return "F4:7D:EF:57:50:F3";
  }
  if (username === "mmucic00") {
    return "70:CE:8C:F5:6F:06";
  }
  if (username === "mbrigi00") {
    return "CC:21:19:E8:8F:9C";
  }
};

app.get("/", (req, res) => {
  console.log("Hello");
});

app.get("/students", (req, res) => {
  var students = {};
  Object.keys(activeUsers).map((address) => {
    const user = activeUsers[address];
    if (user.username !== "sgotovac") {
      students = { ...students, [address]: user };
    }
  });
  res.json({ students: students });
});

app.post("/scanning", (req, res) => {
  const address = findAddress(req.body.username);
  if (req.body.isProfesor) {
    if (isScanningActive) {
      //finish class
      clearInterval(intervalID);
      isScanningActive = false;
      activeUsers = {};
      updateAttendance(req.body.classroom);
    } else {
      activeUsers = { ...activeUsers, [address]: req.body };
      startScanning();
    }
  } else {
    activeUsers = { ...activeUsers, [address]: req.body };
  }

  res.json({ message: "success" });
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
export default app;
