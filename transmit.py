#!/usr/bin/env python3

import serial
import sys
import time

prompt = ">> "

def send_command_read_response(s, command, timeout=0.1, encoding="utf-8", print_com=True):
    prev_timeout = s.timeout
    s.reset_input_buffer()

    if print_com:
        print(f"{prompt}{command}")
    if not command.endswith("\n"):
        command += "\n"

    s.timeout = timeout
    s.write(command.encode(encoding))
    response = s.readline().decode(encoding)

    if response.startswith(prompt):
        response = response[len(prompt):]
    response = response.rstrip()
    if print_com:
        print(f"{response}")

    s.timeout = prev_timeout
    return response

def main():
    s = serial.Serial(port='/dev/ttyACM0', baudrate=115200)
    if not s.is_open:
        print("Serial port is not open")
        sys.exit(-1)
    
    # Start by flushing all that is printed at start
    s.timeout = 2 # Takes less than 2 seconds for Arduino to restart
    s.readline()
    time.sleep(0.5)
    s.reset_input_buffer()

    # Start reading out info
    build_date = send_command_read_response(s, "version")
    device = send_command_read_response(s, "?")
    command = " ".join(sys.argv[1:])
    response = send_command_read_response(s, command, timeout=2)

if __name__ == "__main__":
    main()

