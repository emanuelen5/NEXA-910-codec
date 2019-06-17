#include "controller.h"
#include <string.h>

uint8_t get_ctrl_byte(uint8_t index, bool group_bit, NEXA_Switch_Controller::switch_state_t state) {
	uint8_t ctrl = CTRL_INIT;

	if (state == NEXA_Switch_Controller::OFF) {
		ctrl |= CTRL_SWITCH_OFF;
	} else {
		ctrl |= CTRL_SWITCH_ON;
	}

	if (group_bit) {
		ctrl |= CTRL_ADDRESS_BY_GROUP | CTRL_SWITCH_INDEX_MASK;
	} else {
		ctrl |= CTRL_ADDRESS_BY_INDEX | ((CTRL_SWITCH_INDEX_MASK - index) & CTRL_SWITCH_INDEX_MASK);
	}

	return ctrl;
}

void NEXA_Switch_Controller::send_packet(uint8_t index, bool group_bit, switch_state_t state) {
	NEXA_Packet_t packet;
	memcpy(&packet.id, id, ID_T_SIZE);
	packet.ctrl = get_ctrl_byte(index, group_bit, state);
	this->tx.send_packet((uint8_t *)&packet, sizeof(packet), this->repetition_count);
}

void NEXA_Switch_Controller::set_switch(uint8_t index, switch_state_t state) {
	send_packet(index, false, state);
}

void NEXA_Switch_Controller::set_group(switch_state_t state) {
	send_packet(0, true, state);
}
