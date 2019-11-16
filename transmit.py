#!/usr/bin/env python3

import serial
import sys
import time


class TimeoutOverride:
    def __init__(self, s, timeout):
        self.s = s
        self.timeout = timeout or s.timeout

    def __enter__(self):
        self.old_timeout = self.s.timeout
        self.s.timeout = self.timeout

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.s.timeout = self.old_timeout

class NEXA_UART(object):
    prompt = ">> "

    def __init__(self, port):
        self.s = serial.Serial(port, baudrate=115200)
        if not self.s.is_open:
            print("Serial port is not open")
            sys.exit(-1)

        # Wait until it starts printin (takes less than 2 seconds for it to start)
        self.s.timeout = 2
        self.s.readline()
        # Let it finish printing
        time.sleep(0.5)
        self.s.reset_input_buffer()

        self.build_date = self.send_command("version")
        self.device = self.send_command("?")

    def send_command(self, command, timeout_override=None, encoding="utf-8"):
        with TimeoutOverride(self.s, timeout_override):
            self.s.reset_input_buffer()

            if not command.endswith("\n"):
                command += "\n"

            self.s.write(command.encode(encoding))
            response = self.s.readline().decode(encoding)

            if response.startswith(self.prompt):
                response = response[len(self.prompt):]
            response = response.rstrip()
        return response

    def send_command_read_response(nexa_uart, command, timeout_override=0.1, print_com=True):
        if print_com:
            print(f"{nexa_uart.prompt}{command}")
        response = nexa_uart.send_command(command, timeout_override=timeout_override)
        if print_com:
            print(f"{response}")

def main():
    nexa_uart = NEXA_UART(port='/dev/ttyACM0')

    # Start reading out info
    print(f"Device name: {nexa_uart.device}")
    print(f"{nexa_uart.build_date}")

    # Take command from input arguments
    command = " ".join(sys.argv[1:])
    response = nexa_uart.send_command_read_response(command, timeout_override=2)

if __name__ == "__main__":
    main()

