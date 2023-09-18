import bluetooth
import sys

for i in range(1, len(sys.argv)):
    result = bluetooth.lookup_name(sys.argv[i], timeout=5)
    if result != None:
        print(sys.argv[i])
