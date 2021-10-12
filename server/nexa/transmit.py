#!/usr/bin/env python3

import serial
import serial.tools.list_ports
import sys
import time
import re
from threading import RLock


class TimeoutOverride:
    def __init__(self, s, timeout):
        self.s = s
        self.timeout = timeout or s.timeout

    def __enter__(self):
        self.old_timeout = self.s.timeout
        self.s.timeout = self.timeout

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.s.timeout = self.old_timeout


class NEXA_UART_Init_Failed(TypeError):
    pass


class NEXA_UART:
    prompt = ">> "
    device_pattern = r'\bNEXA 910\b'

    def __init__(self, port):
        self.port = port
        self.serial_lock = RLock()
        self.s = serial.Serial(port, baudrate=115200)
        if not self.s.is_open:
            print("Serial port is not open")
            sys.exit(-1)

        # Wait until it starts printing (takes less than 2 seconds for it to start)
        self.s.timeout = 2
        self.s.write_timeout = 0
        self.s.readline()
        # Let it finish printing
        time.sleep(0.5)
        self.s.reset_input_buffer()

        self.device = self.send_command("?")
        self.build_date = self.send_command("version")

        # Check that we actually have a NEXA_UART device on the line
        self.verify()

    def verify(self):
        if re.search(self.device_pattern, self.device) is None:
            raise NEXA_UART_Init_Failed("Device response was unexpected. Expected {self.device_pattern}. Got {self.device}")

    def send_command(self, command, timeout_override=None, encoding="utf-8"):
        with TimeoutOverride(self.s, timeout_override), self.serial_lock:
            self.s.reset_input_buffer()

            if not command.endswith("\n"):
                command += "\n"

            self.s.write(command.encode(encoding))
            response = self.s.readline().decode(encoding)

            if response.startswith(self.prompt):
                response = response[len(self.prompt):]
            response = response.rstrip()
        return response

    def send_command_read_response(self, command, timeout_override=0.1, print_com=True):
        if print_com:
            print(f"{self.prompt}{command}")
        response = self.send_command(command, timeout_override=timeout_override)
        if print_com:
            print(f"{response}")

    @classmethod
    def get_connected(cls):
        comlist = serial.tools.list_ports.comports()
        ports = []
        for comport in comlist:
            try:
                nexa_uart = cls(port=comport.device)
                ports.append(nexa_uart)
            except NEXA_UART_Init_Failed:
                pass
        return ports


def main():
    nexa_uart = NEXA_UART.get_connected()[0]

    # Start reading out info
    print(f"COM-port device: {nexa_uart.port}")
    print(f"Device name: {nexa_uart.device}")
    print(f"{nexa_uart.build_date}")

    # Take command from input arguments
    command = " ".join(sys.argv[1:])
    nexa_uart.send_command_read_response(command, timeout_override=2)


if __name__ == "__main__":
    main()
