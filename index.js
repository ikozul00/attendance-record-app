import express from "express";
import { scanAvailableDevices } from "./scanDevices.js";

// Initialize Express
const app = express();

const activeUsers = {
  "F4:7D:EF:57:50:F3": { username: "ikozul00", isProfesor: false },
  "E0:AA:96:BB:17:5F": { username: "sgotovac", isProfesor: true },
};

var intervalID;

const startScanning = () => {
  intervalID = setInterval(scanAvailableDevices, 10000, activeUsers);
};

// try {
//   // Create GET request
app.get("/", (req, res) => {
  clearInterval(intervalID);
  //read data from database (https://firebase.google.com/docs/database/web/read-and-write#web-version-9)
  //     onValue(
  //       ref(database, "/user/"),
  //       (snapshot) => {
  //         res.send({ message: snapshot.val() });
  //       },
  //       {
  //         onlyOnce: true,
  //       }
  //     );
});
// } catch (error) {
//   console.error(error);
//}
// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

startScanning();

// Export the Express API
export default app;
