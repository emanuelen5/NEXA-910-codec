#include "transmit.h"

void NEXA_Transmitter::send_packet(uint8_t *byte, uint8_t len) {
	send_data_symbol(START);
	for (int i=0; i<len; i++) {
		if (byte[i])
			send_data_symbol(ONE);
		else
			send_data_symbol(ZERO);
	}
	send_data_symbol(STOP);
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
	int delay_time;
	switch (symbol) {
		case ZERO:  delay_time =    T; break;
		case ONE:   delay_time =  5*T; break;
		case START: delay_time = 10*T; break;
		case STOP:  delay_time = 40*T; break;
	}

	digitalWrite(pin, HIGH);
	delay(delay_time);
	digitalWrite(pin, LOW);
	delay(T);
}
