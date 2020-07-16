[![Build Status](https://travis-ci.org/emanuelen5/NEXA-910-codec.svg?branch=master)](https://travis-ci.org/emanuelen5/NEXA-910-codec)
# NEXA PET-910 codec

Codec for the NEXA-910 remote switches.

The `data` folder contains four second recordings of pressing the buttons on a NEXA-910 remote.

## Data format

The data is encoded in several layers. I will denote the layers as radio symbols, data symbols and packets.

### Radio symbols

Each radio symbol is represented by a period of logical high and then a period of logical low ([shown in this WaveJSON](doc/radio_symbol.wavejson)). The period of logical high, `T_H`, is the same for all symbols. `T_H` is one time constant, called `T`, long. The period of logical low, `T_L`, is different for each symbol, but always a multiple of the same time constant `T`.

`T` should be 250 microseconds, but may vary slightly.

There are four radio symbols. Their meaning and timing are described in the table below.

| Radio symbol | Description                 | `T_H` |  `T_L` |
|:------------:|:----------------------------|------:|-------:|
|    **0**     | Zero (part of data symbols) |   `T` |  1*`T` |
|    **1**     | One (part of data symbols)  |   `T` |  5*`T` |
|    **S**     | Start symbol                |   `T` | 10*`T` |
|    **P**     | Stop symbol                 |   `T` | 40*`T` |

![Diagram of radio symbols](./doc/radio_symbol.svg)

### Data symbols

The data symbols (0 and 1) consist of a **0** and a **1** radio symbol. This makes each bit of data take a constant time to transfer on the radio link, which nice from a decoding perspective.
