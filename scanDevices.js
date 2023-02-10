import { spawn } from "child_process";
import { increment, set, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2Squim3XPlaqIlbV4lNb-Nx6Qz5JjNNQ",
  authDomain: "attendance-record-app-7e8e5.firebaseapp.com",
  projectId: "attendance-record-app-7e8e5",
  storageBucket: "attendance-record-app-7e8e5.appspot.com",
  messagingSenderId: "235122994474",
  appId: "1:235122994474:web:2ab70ea249ca23ba9a8253",
  databaseURL:
    "https://attendance-record-app-7e8e5-default-rtdb.europe-west1.firebasedatabase.app",
};
// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

//get Database
const database = getDatabase(appFirebase);

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
        // doesn't work, need to find how to insert data in database
        if (!user.isProfesor) {
          update(
            ref(
              `Ucionice/B401/Ugradbeni računalni sustavi/Studetni/` +
                user.username,
              { value: 3 }
            )
          );
          // database
          //   .ref("Ucionice/B401/Ugradbeni računalni sustavi/Studetni")
          //   .child(user.username)
          //   .set(database.ServerValue.increment(1));
        }
      }
    });
  });
};

const incrementUsers = (activeUsers, addresses) => {
  // console.log(activeUsers);
  // addresses.map((address) => {
  //   if (address) {
  //     console.log(address);
  //     const user = activeUsers[address];
  //     console.log(user);
  // if (!user.isProfesor) {
  //   database
  //     .ref("Ucionice/B401/Ugradbeni računalni sustavi/Studetni")
  //     .child(user.username)
  //     .set(database.ServerValue.increment(1));
  // }
  //   }
  // });
};
