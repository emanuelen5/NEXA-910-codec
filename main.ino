#include "transmit.h"
#include "controller.h"
#include <string.h>

#define TX_PIN 8
char id[3] = {
	static_cast<char>(0x89),
	static_cast<char>(0x47),
	static_cast<char>(0x4E)
};
NEXA_Protocol_Transmitter txer(TX_PIN);
NEXA_Switch_Controller controller(txer, id);

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
	if (input_available()) {
		// Do something with the received input command
		if (STREQ(input_buffer, "?")) {
			Serial.println("NEXA 910 transmitter");
		} else if (STREQ(input_buffer, "1 on")) {
			controller.set_switch(0, NEXA_Switch_Controller::ON);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "1 off")) {
			controller.set_switch(0, NEXA_Switch_Controller::OFF);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "2 on")) {
			controller.set_switch(1, NEXA_Switch_Controller::ON);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "2 off")) {
			controller.set_switch(1, NEXA_Switch_Controller::OFF);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "3 on")) {
			controller.set_switch(2, NEXA_Switch_Controller::ON);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "3 off")) {
			controller.set_switch(2, NEXA_Switch_Controller::OFF);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "all on")) {
			controller.set_group(NEXA_Switch_Controller::ON);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else if (STREQ(input_buffer, "all off")) {
			controller.set_group(NEXA_Switch_Controller::OFF);
			Serial.print("OK: ");
			Serial.println(input_buffer);
		} else {
			Serial.print("Unknown command: ");
			Serial.println(input_buffer);
		}
	}
}
