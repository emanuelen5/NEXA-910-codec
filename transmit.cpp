#include "Arduino.h"
#include "transmit.h"

void NEXA_Protocol_Transmitter::send_packet(uint8_t *bytes, uint8_t len) {
	send_data_symbol(START);
	for (int i=0; i<len; i++) {
		send_byte(bytes[i]);
	}
	send_data_symbol(STOP);
}

void Transmitter::send_packet(uint8_t *bytes, uint8_t len, uint8_t repeat_count) {
	for (int i=0; i<repeat_count; i++) {
		send_packet(bytes, len);
	}
}

void NEXA_Protocol_Transmitter::send_byte(uint8_t byte) {
	for (uint8_t b=1; b<=8; b++) {
		if ((byte >> (8-b)) & 1)
			send_data_symbol(ONE);
		else
			send_data_symbol(ZERO);
	}
}

void NEXA_Protocol_Transmitter::send_data_symbol(symbol_t symbol) {
	switch (symbol) {
		case ZERO:
			send_radio_symbol(ONE);
			send_radio_symbol(ZERO);
			break;
		case ONE:
			send_radio_symbol(ZERO);
			send_radio_symbol(ONE);
			break;
		default:
			send_radio_symbol(symbol);
	}
}

void NEXA_Protocol_Transmitter::send_radio_symbol(symbol_t symbol) {
	int low_time_us = 0;
	switch (symbol) {
		case ZERO:  low_time_us =    T; break;
		case ONE:   low_time_us =  5*T; break;
		case START: low_time_us = 10*T; break;
		case STOP:  low_time_us = 40*T; break;
	}

	digitalWrite(pin, HIGH);
	delayMicroseconds(T);
	digitalWrite(pin, LOW);
	delayMicroseconds(low_time_us);
}
