# NEXA-910-codec
Codec for NEXA-910 remote switches (though currently only encoding/transmission).

Includes two projects, one for the Arduino and another for a PC.

# Arduino
The low-level protocol for controlling NEXA switches. Commands are issued through its UART interface.

# REST API
A REST-wrapper for the Arduino that lets it be controlled through simple HTTP requests. Also exposes a simple web app for issuing requests.
