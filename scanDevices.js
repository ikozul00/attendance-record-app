import { spawn } from "child_process";

export const scanAvailableDevices = (addresses) => {
  var availableAddresses = [];
  const python = spawn("python", ["./bluetoothPing.py", "F4:7D:EF:57:50:F3"]);

  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    availableAddresses.push(data.toString());
  });

  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // availableAddresses.map((address) => console.log(address));
    availableAddresses.map((address) => console.log(address));
  });
};
