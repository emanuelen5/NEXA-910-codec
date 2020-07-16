#ifndef CONTROLLER_h
#define CONTROLLER_h

#include "transmit.h"

#define CTRL_INIT                 0x40 // What do the topmost two bits do?
#define CTRL_ADDRESS_BY_INDEX     0x20 // I.e. do not address by group
#define CTRL_ADDRESS_BY_GROUP     0x00
#define CTRL_SWITCH_OFF           0x10
#define CTRL_SWITCH_ON            0x00
#define CTRL_SWITCH_INDEX_MASK    0x0F

#define ID_T_SIZE 3

class NEXA_Switch_Controller {
public:
	typedef char ID_t[ID_T_SIZE];
	enum switch_state_t {ON, OFF};
	NEXA_Switch_Controller(Transmitter &tx, ID_t &id, uint8_t repetition_count = 5) : tx(tx), repetition_count(repetition_count) {
		for (uint8_t i=0; i<sizeof(id); i++) this->id[i] = id[i];
	};
	void set_group(switch_state_t state);
	void set_switch(uint8_t index, switch_state_t state);
protected:
	ID_t id;
	Transmitter &tx;
	uint8_t repetition_count = 5;

	typedef struct NEXA_Packet_t {
		ID_t id;
		uint8_t ctrl;
	} NEXA_Packet_t;
	void send_packet(uint8_t index, bool group_bit, switch_state_t state);
};

#endif // CONTROLLER_h
