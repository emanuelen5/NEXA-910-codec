#include "transmit.h"

#define TX_PIN 8
NEXA_Transmitter nt(TX_PIN);
uint8_t ON_3[] = {0x89, 0x47, 0x4E, 0x6D};

void setup() {
	Serial.begin(115200);
	Serial.print("Starting board. Connect transmitter to pin ");
	Serial.println(TX_PIN, DEC);
	nt.send_packet(ON_3, 4);
}

void loop() {
	Serial.println("Sending again");
	delay(1000);
	nt.send_packet(ON_3, 4);
}
