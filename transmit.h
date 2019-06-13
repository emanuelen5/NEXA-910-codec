#ifndef TRANSMIT_h
#define TRANSMIT_h

#include "Arduino.h"

class Transmitter {
public:
    Transmitter(int pin) : pin(pin) {
    };
    virtual void send_packet(uint8_t *bytes, uint8_t len);
protected:
    int pin;
};

class NEXA_Transmitter : public Transmitter {
public:
    NEXA_Transmitter(int pin) : Transmitter(pin) {
        pinMode(pin, OUTPUT);
        digitalWrite(pin, LOW);
    };
    void send_packet(uint8_t *bytes, uint8_t len);
    void send_packet(uint8_t *bytes, uint8_t len, uint8_t repeat_count);
protected:
    int T=250; // Base time unit in us
    enum symbol_t {
        ZERO,
        ONE,
        STOP,
        START
    };

    void send_byte(uint8_t byte);
    void send_data_symbol(symbol_t symbol);
    void send_radio_symbol(symbol_t symbol);

};

#endif // TRANSMIT_h
