#ifndef CONTROLLER_h
#define CONTROLLER_h

#include "transmit.h"

// SWITCH_1_ON[]    = 0x6F
// SWITCH_1_OFF[]   = 0x7F
// SWITCH_2_ON[]    = 0x6E
// SWITCH_2_OFF[]   = 0x7E
// SWITCH_3_ON[]    = 0x6D
// SWITCH_3_OFF[]   = 0x7D
// SWITCH_ALL_ON[]  = 0x4F
// SWITCH_ALL_OFF[] = 0x5F

class NEXA_Switch_Controller {
public:
	typedef char ID_t[3];
	enum switch_state_t {ON, OFF};
	NEXA_Switch_Controller(Transmitter tx, ID_t id) : tx(tx) {
		for (uint8_t i=0; i<sizeof(id); i++) this->id[i] = id[i];
	};
	void set_group(switch_state_t state);
	void set_switch(uint8_t index, switch_state_t state);
protected:
	ID_t id;
	Transmitter &tx;
};

#endif // CONTROLLER_h
