import { spawn } from "child_process";
import { ref, increment, update, set, get } from "firebase/database";
import database from "./connectToDatabase.js";
import { getCurrentDate } from "./helper-functions.js";

export const scanAvailableDevices = (activeUsers) => {
  console.log(activeUsers);
  const addresses = Object.keys(activeUsers);
  const python = spawn("python", ["./bluetoothPing.py", ...addresses]);
  var activeAddresses = [];

  python.stdout.on("data", async function (data) {
    activeAddresses.push(data.toString());
  });

  python.on("close", (code) => {
    console.log(activeAddresses);
    const date = getCurrentDate();
    console.log(`child process close all stdio with code ${code}`);
    get(ref(database, `root/Ucionice/B401/${date}/`))
      .then((snapshot) => {
        if (!snapshot.exists()) {
          set(
            ref(
              database,
              `root/Ucionice/B401/${date}/Ugradbeni računalni sustavi`
            ),
            {
              Profesor: { ime: "sgotovac", value: 0 },
              Studetni: {
                ikozul00: { value: 0 },
                mmucic00: { value: 0 },
                mbrigi00: { value: 0 },
              },
            }
          );
        }
        activeAddresses = activeAddresses[0].split("\n");
        activeAddresses.map((address) => {
          address = address.split("\n")[0];
          if (address) {
            const user = activeUsers[address];
            console.log(user);
            if (!user?.isProfesor) {
              update(
                ref(
                  database,
                  `root/Ucionice/${user.classroom}/${date}/Ugradbeni računalni sustavi/Studetni/` +
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
        activeAddresses = [];
      })
      .catch((error) => {
        console.error(error);
      });
  });
};
