# Attendance record app
This system has been developed as a seminar for the course Embedded Computer Systems. The goal of the system is to detect which students are present in a lecture room, easily and accurately. The system
consists of a mobile app, a server and a database. The mobile app has been developed using React Native.
The server has been developed using Express JS and a little bit of Python code. Python code is used to scan Bluetooth devices in the room. The server is running on
Raspberry Pi 4. The server uses Bluetooth and NFC technology to keep track of present students. Data is stored in
the Firebase Realtime database.

## System

![image](https://github.com/ikozul00/attendance-record-app/assets/73161194/d2009079-cc6e-439e-a77b-d705609ff36e)

For the system to work students and professors need to have a mobile app installed on their devices. Every classroom has an NFC tag assigned to it. When entering and leaving the classroom professor and students need to scan a tag. The server needs to keep track of more devices, so it doesn't make a Bluetooth connection with a device it only scans for available Bluetooth devices. The server needs to know the MAC addresses of students' and professors' devices so it can compare all the available devices to known devices, i.e. connect the device with a student or professor. 

## Mobile app

**Setting up environment:** https://reactnative.dev/docs/environment-setup (follow directions for Android)

**Starting an app:** yarn android

# API

To run a server:
- position in api folder
- run: **node index.js**
