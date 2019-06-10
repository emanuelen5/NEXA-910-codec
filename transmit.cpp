#include "transmit.h"

void NEXA_Transmitter::send_packet(uint8_t *bytes, uint8_t len) {
	send_data_symbol(START);
	for (int i=0; i<len; i++) {
		send_byte(bytes[i]);
	}
	send_data_symbol(STOP);
}

void NEXA_Transmitter::send_byte(uint8_t byte) {
	for (uint8_t b=0; b<8; b++) {
		if ((byte >> (8-b)) & 1)
			send_data_symbol(ONE);
		else
			send_data_symbol(ZERO);
	}
}

void NEXA_Transmitter::send_data_symbol(symbol_t symbol) {
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

void NEXA_Transmitter::send_radio_symbol(symbol_t symbol) {
	int high_time_us = 0;
	switch (symbol) {
		case ZERO:  high_time_us =    T; break;
		case ONE:   high_time_us =  5*T; break;
		case START: high_time_us = 10*T; break;
		case STOP:  high_time_us = 40*T; break;
	}

	digitalWrite(pin, HIGH);
	delayMicroseconds(high_time_us);
	digitalWrite(pin, LOW);
	delayMicroseconds(T);
}
