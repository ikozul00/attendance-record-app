import { spawn } from "child_process";
import { ref, increment, update } from "firebase/database";
import database from "./connectToDatabase.js";

const getCurrentDate = () => {
  const date = new Date();
  const day = date.getDate();
  let month = date.getMonth() + 1;
  if (month < 10) month = 0 + "" + month;
  const year = date.getFullYear();

  return day + "" + month + "" + year;
};

export const scanAvailableDevices = (activeUsers) => {
  const addresses = Object.keys(activeUsers);
  const python = spawn("python", ["./bluetoothPing.py", ...addresses]);
  const activeAddresses = [];

  python.stdout.on("data", async function (data) {
    activeAddresses.push(data.toString());
  });

  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    addresses.map((address) => {
      if (address) {
        const user = activeUsers[address];
        const date = getCurrentDate();
        if (!user.isProfesor) {
          update(
            ref(
              database,
              `root/Ucionice/B401/${date}/Ugradbeni računalni sustavi/Studetni/` +
                user.username
            ),
            { value: increment(1) }
          );
        } else {
          update(
            ref(
              database,
              `root/Ucionice/B401/${date}/Ugradbeni računalni sustavi/Profesor/`
            ),
            { ime: "sgotovac", value: increment(1) }
          );
        }
      }
    });
  });
};
