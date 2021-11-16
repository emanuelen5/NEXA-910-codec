# NEXA-910 controller
Application and firmware for controlling NEXA-910 remote switches (currently only for encoding/transmission of commands, not snooping).

Includes two projects, one with firmware that runs on an Arduino-compatible board and another for a PC that presents a nice GUI through a web server.


# Demonstration
![Demonstration video showing how to control lights, and adding a switch group](./demonstration.gif)


# Sub-projects
## Arduino
The low-level protocol for controlling NEXA switches. Commands are issued through its UART interface. It sends the control commands through a radio transmitter by bit-banging ON-OFF coded messages that contains the switch ID and its state.

## Web application
A REST-wrapper for the Arduino that lets it be controlled through simple HTTP requests. It also exposes a simple web app for issuing requests, and storing configurations with switch names and groups.
