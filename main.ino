#include "transmit.h"
#include <string.h>

#define TX_PIN 8
NEXA_Protocol_Transmitter nt(TX_PIN);
uint8_t SWITCH_1_ON[]    = {0x89, 0x47, 0x4E, 0x6F};
uint8_t SWITCH_1_OFF[]   = {0x89, 0x47, 0x4E, 0x7F};
uint8_t SWITCH_2_ON[]    = {0x89, 0x47, 0x4E, 0x6E};
uint8_t SWITCH_2_OFF[]   = {0x89, 0x47, 0x4E, 0x7E};
uint8_t SWITCH_3_ON[]    = {0x89, 0x47, 0x4E, 0x6D};
uint8_t SWITCH_3_OFF[]   = {0x89, 0x47, 0x4E, 0x7D};
uint8_t SWITCH_ALL_ON[]  = {0x89, 0x47, 0x4E, 0x4F};
uint8_t SWITCH_ALL_OFF[] = {0x89, 0x47, 0x4E, 0x5F};

const char *TERMINATOR_CHARS = "\t\n\r";
#define INPUT_BUFFER_SIZE 16
char input_buffer[INPUT_BUFFER_SIZE+1];
bool input_available(void) {
	if (Serial.available()) {
		int chars_read = Serial.readBytes(input_buffer, INPUT_BUFFER_SIZE);
		// Check that it ends with a terminator char and replace it with EOF
		if (strchr(TERMINATOR_CHARS, input_buffer[chars_read-1]) != NULL) {
			input_buffer[chars_read-1] = '\0';
			return true;
		}
	}
	return false;
}

void setup() {
	Serial.begin(115200);
	Serial.print("Starting board. Connect transmitter to pin ");
	Serial.println(TX_PIN, DEC);
	Serial.setTimeout(50);
}

#define STREQ(STR1, STR2) (strcmp(STR1, STR2) == 0)
void loop() {
	const uint8_t repeat_count = 5;
	if (input_available()) {
		// Do something with the received input command
		if (STREQ(input_buffer, "?")) {
			Serial.println("NEXA 910 transmitter");
		} else if (STREQ(input_buffer, "1 on")) {
			nt.send_packet(SWITCH_1_ON, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "1 off")) {
			nt.send_packet(SWITCH_1_OFF, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "2 on")) {
			nt.send_packet(SWITCH_2_ON, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "2 off")) {
			nt.send_packet(SWITCH_2_OFF, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "3 on")) {
			nt.send_packet(SWITCH_3_ON, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "3 off")) {
			nt.send_packet(SWITCH_3_OFF, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "all on")) {
			nt.send_packet(SWITCH_ALL_ON, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "all off")) {
			nt.send_packet(SWITCH_ALL_OFF, 4, repeat_count);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else {
			Serial.print("Unknown command: ");
			Serial.println(input_buffer);
		}
	}
}
