import bluetooth
import sys

addresses = ["F4:7D:EF:57:50:F3", "E0:AA:96:BB:17:5F"]
for address in addresses:
    print(address)
    result = bluetooth.lookup_name(address, timeout=5)
    if result != None:
        print(f"{result} is present")
    else:
        print("Nije")
