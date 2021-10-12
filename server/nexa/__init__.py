import os
import logging
logger = logging.getLogger(__name__)

if os.environ.get("NEXA_BACKEND", None) == "MOCK":
    logger.warning("Using mocked NEXA backend")
    from .transmit_mock import NEXATransmitMock as NEXA_UART
else:
    from .transmit import NEXA_UART
from .transmit import NEXA_UART_Init_Failed
